import React from 'react';
import { Metadata } from 'next';
import PortalAlunoClientPage from './components/PortalAlunoClientPage';

export const metadata: Metadata = {
  title: 'Portal do Aluno - Universidade Lusíada de São Tomé e Príncipe | ULSTP',
  description: 'Acesse seus serviços acadêmicos, notas, horários, biblioteca digital e documentos na Universidade Lusíada de São Tomé e Príncipe.',
};

const PortalAlunoPage = () => {
  return <PortalAlunoClientPage />;
};

export default PortalAlunoPage; 