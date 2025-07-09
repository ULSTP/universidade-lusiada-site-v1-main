"use client"

import React, { useState } from 'react';
import { motion } from "framer-motion";

// Tipos
interface StatProps {
  number: string;
  label: string;
  index: number;
}

interface ContactInfoProps {
  icon: string;
  title: string;
  content: string;
}

// Constantes para reutilização
const STATS = [
  { number: "2500+", label: "Alunos Formados" },
  { number: "120+", label: "Professores" },
  { number: "25+", label: "Cursos" },
  { number: "15+", label: "Parcerias Internacionais" },
];

const CONTACT_INFO = [
  { icon: "📍", title: "Endereço", content: "Rua da Independência, São Tomé" },
  { icon: "📞", title: "Contacto", content: "+239 222 21 71" },
  { icon: "✉️", title: "Email", content: "info@ulstp.st" },
];

// Componente para estatísticas
const StatCard: React.FC<StatProps> = ({ number, label, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.8 }}
    className="text-center"
  >
    <div className="text-4xl font-bold text-lusiada-blue-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </motion.div>
);

// Componente para informações de contato
const ContactInfo: React.FC<ContactInfoProps> = ({ icon, title, content }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-lusiada-blue-100 rounded-full flex items-center justify-center">
      <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

/**
 * Componente NewsletterForm
 * 
 * Gerencia o formulário de inscrição na newsletter com:
 * - Validação de e-mail
 * - Proteção contra spam (honeypot)
 * - Feedback visual
 * - Sanitização de inputs
 * 
 * @returns {JSX.Element} Formulário de newsletter
 */
const NewsletterForm: React.FC = () => {
  // Estados do formulário
  const [email, setEmail] = useState(''); // E-mail do usuário
  const [honeypot, setHoneypot] = useState(''); // Campo oculto para detecção de bots
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle'); // Estado do formulário
  const [error, setError] = useState(''); // Mensagem de erro

  /**
   * Manipula o envio do formulário
   * - Valida o e-mail
   * - Envia para a API
   * - Atualiza o estado
   * - Mostra feedback
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    
    // Sanitização e validação do e-mail
    const cleanEmail = sanitize(email.trim());
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError('Por favor, insira um e-mail válido.');
      setStatus('error');
      return;
    }

    try {
      // Envio para a API
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, honeypot })
      });
      const data = await res.json();

      // Tratamento da resposta
      if (res.ok && data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setError(data.error || 'Erro ao inscrever.');
        setStatus('error');
      }
    } catch {
      setError('Erro de conexão.');
      setStatus('error');
    }
  };

  return (
    <form 
      className="flex flex-col sm:flex-row gap-4 justify-center items-center" 
      onSubmit={handleSubmit} 
      autoComplete="off"
    >
      {/* Campo de e-mail */}
      <input
        type="email"
        required
        placeholder="Seu e-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-lusiada-blue-600"
        aria-label="E-mail"
        autoComplete="off"
      />

      {/* Campo honeypot para detecção de bots */}
      <input
        type="text"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Botão de envio */}
      <button
        type="submit"
        className="bg-lusiada-blue-600 text-white px-6 py-2 rounded hover:bg-lusiada-blue-700 transition-colors font-semibold"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Enviando...' : 'Inscrever-se'}
      </button>

      {/* Feedback visual */}
      {status === 'success' && (
        <span className="text-green-600 ml-2">Inscrição realizada com sucesso!</span>
      )}
      {status === 'error' && (
        <span className="text-red-600 ml-2">{error}</span>
      )}
    </form>
  );
};

/**
 * Função de sanitização
 * Remove caracteres potencialmente perigosos do input
 * 
 * @param {string} input - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
function sanitize(input: string) {
  return input.replace(/[<>"'`]/g, '');
}

const SobrePage = () => {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-[#1B3159] text-white py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl font-bold mb-4"
          >
            Sobre a ULSTP
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg max-w-2xl mx-auto"
          >
            Conheça nossa história, missão e valores que nos tornam uma referência no ensino superior em São Tomé e Príncipe
          </motion.p>
        </div>
      </motion.section>

      {/* História e Missão */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                A Universidade Lusíada de São Tomé e Príncipe (ULSTP) foi fundada em 2009, com o objetivo de proporcionar 
                educação superior de qualidade e contribuir para o desenvolvimento do país.
              </p>
              <p className="text-gray-600">
                Ao longo dos anos, temos formado profissionais competentes e comprometidos com o progresso de São Tomé e 
                Príncipe, mantendo parcerias com instituições internacionais e investindo constantemente na qualidade do ensino.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Campus ULSTP"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-lusiada-gold-600 text-white p-4 rounded-lg">
                <p className="font-bold">Fundada em 2009</p>
                <p className="text-sm">15 anos de excelência</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-bold mb-4"
            >
              Missão, Visão e Valores
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-24 h-1 bg-lusiada-gold-600 mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="w-16 h-16 bg-lusiada-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Missão</h3>
              <p className="text-gray-600 text-center">
                Formar profissionais qualificados e cidadãos éticos, contribuindo para o desenvolvimento 
                sustentável de São Tomé e Príncipe através da excelência no ensino e na pesquisa.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="w-16 h-16 bg-lusiada-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">👁️</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Visão</h3>
              <p className="text-gray-600 text-center">
                Ser reconhecida como uma instituição de referência no ensino superior em África, 
                destacando-se pela inovação, qualidade académica e impacto social.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="w-16 h-16 bg-lusiada-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Valores</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="text-center">Excelência Académica</li>
                <li className="text-center">Ética e Integridade</li>
                <li className="text-center">Inovação</li>
                <li className="text-center">Responsabilidade Social</li>
                <li className="text-center">Compromisso com o Desenvolvimento</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Números e Conquistas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Números e Conquistas
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">Nossa Localização</h2>
              <p className="text-gray-600 mb-4">
                Estamos localizados em uma área privilegiada de São Tomé, com fácil acesso e infraestrutura moderna 
                para proporcionar a melhor experiência académica aos nossos estudantes.
              </p>
              <div className="space-y-4">
                {CONTACT_INFO.map((info, index) => (
                  <ContactInfo key={index} {...info} />
                ))}
              </div>
              {/* Redes Sociais */}
              <div className="mt-8">
                <h3 className="font-semibold mb-2">Redes Sociais</h3>
                <div className="flex gap-4">
                  <a href="https://facebook.com/ulstp" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors" title="Facebook">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                  </a>
                  <a href="https://instagram.com/ulstp" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-colors" title="Instagram">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.094 12 2.094zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.635.4 3.661 1.374c-.974.974-1.246 2.241-1.308 3.608C2.175 5.647 2.163 6.027 2.163 12s.012 6.353.07 7.018c.062 1.366.334 2.633 1.308 3.608.974.974 2.241 1.246 3.608 1.308C8.353 23.988 8.733 24 12 24s3.647-.012 4.85-.07c1.366-.062 2.633-.334 3.608-1.308.974-.974 1.246-2.241 1.308-3.608.058-1.266.069-1.646.069-4.85s-.012-3.584-.07-4.85c-.062-1.366-.334-2.633-1.308-3.608-.974-.974-2.241-1.246-3.608-1.308C15.647.012 15.267 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 12 8a3.999 3.999 0 0 1 0 7.999z"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/ulstp" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-800 transition-colors" title="LinkedIn">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.845-1.563 3.042 0 3.604 2.003 3.604 4.605v5.591z"/></svg>
                  </a>
                  <a href="https://wa.me/2399999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-green-600 transition-colors" title="WhatsApp">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.26-1.64A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.68-.5-5.26-1.44l-.38-.22-3.72.98.99-3.62-.25-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/></svg>
                  </a>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Mapa Interativo */}
              <div className="rounded-lg shadow-xl overflow-hidden">
                <iframe
                  title="Mapa ULSTP"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.123456789!2d7.419856!3d0.336540!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6b2b1b1b1b1b1b%3A0x1b1b1b1b1b1b1b1b!2sUniversidade%20Lus%C3%ADada%20de%20S%C3%A3o%20Tom%C3%A9%20e%20Pr%C3%ADncipe!5e0!3m2!1spt-PT!2sst!4v1710000000000!5m2!1spt-PT!2sst"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Receba novidades da ULSTP</h2>
            <p className="text-gray-600 mb-6">Cadastre-se na nossa newsletter e fique por dentro de eventos, notícias e novidades.</p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>

      {/* Voltar para Página Inicial */}
      <div className="text-center py-8">
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          className="text-lusiada-blue-600 font-semibold hover:underline inline-flex items-center"
        >
          ← Voltar para Página Inicial
        </motion.a>
      </div>
    </main>
  );
};

export default SobrePage; 