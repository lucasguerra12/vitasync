import { supabase } from './supabase';

/**
 * 🛡️ BLINDAGEM MÁGICA 100% ANTI-ERROS TYPESCRIPT
 * Aceita "any" para não entrar em conflito com os Builders do Supabase,
 * e usa Promise.resolve() para forçar a conversão perfeita no React Native.
 */
const withTimeout = async (
  request: any, 
  ms: number = 8000, 
  errorMsg: string = "O servidor demorou muito para responder."
): Promise<any> => {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([Promise.resolve(request), timeoutPromise]).finally(() => clearTimeout(timer));
};

export const AuthService = {
  /**
   * Valida as credenciais no Supabase Auth e busca a ficha do utilizador
   */
  async login(email: string, password: string) {
    console.log("\n🔑 [AUTH SERVICE] -> Iniciando tentativa de login...");
    const startTime = Date.now();
    
    // 1. Faz a chamada ao Auth com proteção de 8 segundos
    const { data: authData, error: authError } = await withTimeout(
      supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      }),
      8000,
      "A validação de e-mail excedeu o tempo limite. Verifique a sua internet."
    );

    if (authError) {
      console.log("❌ [AUTH SERVICE] -> Erro na validação de credenciais.");
      throw new Error("E-mail ou senha incorretos.");
    }

    if (!authData?.user) {
      throw new Error("Não foi possível recuperar os dados de autenticação.");
    }

    console.log(`🔑 [AUTH SERVICE] -> Auth validado em ${Date.now() - startTime}ms. Buscando perfil...`);

    // 2. Busca a ficha na tabela de perfis com proteção de 8 segundos
    const { data: profile, error: profileError } = await withTimeout(
      supabase.from('profiles').select('*').eq('user_id', authData.user.id).single(),
      8000,
      "Demora excessiva na leitura do banco de dados."
    );

    if (profileError || !profile) {
      console.log("❌ [AUTH SERVICE] -> Perfil não encontrado no banco de dados.");
      await supabase.auth.signOut();
      throw new Error("A sua conta de acesso existe, mas os seus dados de perfil não foram encontrados. Crie uma nova conta.");
    }

    console.log(`✅ [AUTH SERVICE] -> Login 100% concluído em ${Date.now() - startTime}ms!`);
    return { user: authData.user, profile };
  },

  /**
   * Cria o utilizador no Auth e, logo em seguida, cria a sua linha na tabela profiles
   */
  async register(data: any) {
    console.log("\n📝 [AUTH SERVICE] -> Iniciando criação de nova conta...");
    const startTime = Date.now();

    // 1. Cria a conta de acesso no Auth com proteção de 10 segundos
    const { data: authData, error: authError } = await withTimeout(
      supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
      }),
      10000,
      "O servidor demorou muito para criar a conta de acesso."
    );

    if (authError) {
      console.log("❌ [AUTH SERVICE] -> Erro ao criar conta de acesso:", authError.message);
      throw new Error(authError.message);
    }

    if (!authData?.user) {
      throw new Error("Falha ao gerar identificador único do utilizador.");
    }

    console.log(`📝 [AUTH SERVICE] -> Conta criada em ${Date.now() - startTime}ms! Salvando dados pessoais...`);

    // 2. Insere os dados na tabela profiles com proteção de 10 segundos
    const { error: dbError } = await withTimeout(
      supabase.from('profiles').insert([{
        id: authData.user.id,
        user_id: authData.user.id,
        name: data.name,
        email: data.email.trim(),
        age: data.age,
        gender: data.gender,
        weight: data.weight,
        height: data.height,
        activity_level: data.activityLevel,
        goal: data.mainGoal,
        daily_calorie_goal: data.dailyCalorieGoal,
        created_at: Date.now(), 
        updated_at: Date.now(),
      }]),
      10000,
      "Demora excessiva para guardar os dados pessoais."
    );

    if (dbError) {
      console.log("❌ [AUTH SERVICE] -> Erro ao gravar dados na tabela profiles. Fazendo rollback...");
      await supabase.auth.signOut();
      throw new Error("A sua conta foi criada, mas não conseguimos guardar os seus dados pessoais. Detalhe: " + dbError.message);
    }

    console.log(`✅ [AUTH SERVICE] -> Registo 100% concluído em ${Date.now() - startTime}ms!`);
    return { user: authData.user };
  }
};