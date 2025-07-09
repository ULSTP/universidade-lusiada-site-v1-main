import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos - Universidade Lusíada de São Tomé e Príncipe | ULSTP',
  description: 'Explore nossos cursos de graduação e pós-graduação na Universidade Lusíada de São Tomé e Príncipe. Engenharia Informática, Gestão, Direito, Economia e Relações Internacionais.',
};

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 