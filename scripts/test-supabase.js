const { PrismaClient } = require('../lib/generated/prisma')

async function testSupabaseConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔌 Testando conexão com Supabase...')
    
    // Testar conexão básica
    await prisma.$connect()
    console.log('✅ Conexão com Supabase estabelecida!')
    
    // Testar se as tabelas existem
    const userCount = await prisma.user.count()
    console.log(`📊 Número de utilizadores na base de dados: ${userCount}`)
    
    console.log('🎉 Supabase está configurado corretamente!')
    
  } catch (error) {
    console.error('❌ Erro na conexão com Supabase:')
    console.error(error.message)
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Dica: Verifique se a senha da base de dados está correta no arquivo .env')
      console.log('DATABASE_URL="postgresql://postgres:SUA_SENHA@db.fagycmqthnsboniogoon.supabase.co:5432/postgres"')
    }
    
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Dica: Execute "npx prisma db push" para criar as tabelas')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testSupabaseConnection() 