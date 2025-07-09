#!/usr/bin/env node

/**
 * Script de Migração para Supabase
 * Sistema Completo Universidade Lusíada
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando migração para Supabase...\n');

// 1. Backup do schema atual
console.log('📦 Fazendo backup do schema atual...');
const currentSchema = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupSchema = path.join(__dirname, '..', 'prisma', 'schema-backup.prisma');

if (fs.existsSync(currentSchema)) {
  fs.copyFileSync(currentSchema, backupSchema);
  console.log('✅ Backup criado: prisma/schema-backup.prisma');
}

// 2. Substituir schema
console.log('\n🔄 Substituindo schema...');
const newSchema = path.join(__dirname, '..', 'prisma', 'schema-supabase-completo.prisma');
if (fs.existsSync(newSchema)) {
  fs.copyFileSync(newSchema, currentSchema);
  console.log('✅ Schema atualizado com estrutura completa');
} else {
  console.log('❌ Arquivo schema-supabase-completo.prisma não encontrado');
  process.exit(1);
}

// 3. Atualizar .env
console.log('\n⚙️ Configurando variáveis de ambiente...');
const envPath = path.join(__dirname, '..', '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Comentar SQLite e ativar Supabase
envContent = envContent.replace(
  /^DATABASE_URL="file:\.\/dev\.db"$/m,
  '# DATABASE_URL="file:./dev.db"'
);

envContent = envContent.replace(
  /^# DATABASE_URL="postgresql:\/\/postgres\.fagycmqthnsboniogoon:/m,
  'DATABASE_URL="postgresql://postgres.fagycmqthnsboniogoon:'
);

fs.writeFileSync(envPath, envContent);
console.log('✅ Variáveis de ambiente configuradas para Supabase');

// 4. Instruções finais
console.log('\n📋 Próximos passos:');
console.log('1. Verifique se o projeto Supabase está ativo');
console.log('2. Execute: npx prisma generate');
console.log('3. Execute: npx prisma db push');
console.log('4. Execute: npm run dev');

console.log('\n🎯 Funcionalidades do novo sistema:');
console.log('• 👥 Gestão completa de utilizadores');
console.log('• 🏢 Sistema de departamentos');
console.log('• 📚 Cursos e disciplinas');
console.log('• 👥 Turmas e horários');
console.log('• 📝 Matrículas e inscrições');
console.log('• 📊 Sistema de notas');
console.log('• 💰 Gestão financeira (propinas/pagamentos)');

console.log('\n✨ Migração preparada com sucesso!');
console.log('📖 Consulte SUPABASE_SETUP_COMPLETO.md para mais detalhes'); 