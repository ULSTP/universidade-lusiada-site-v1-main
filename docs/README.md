# Documentação do Site ULSTP

## Guia de Estilo

### Cores
```css
--lusiada-blue-600: #1B3159;  /* Cor principal */
--lusiada-gold-600: #D4AF37;  /* Cor de destaque */
--gray-50: #F9FAFB;          /* Fundo claro */
--gray-600: #4B5563;         /* Texto secundário */
--gray-900: #111827;         /* Texto principal */
```

### Tipografia
- Fonte Principal: Inter
- Tamanhos:
  - Títulos: 2xl (1.5rem) a 4xl (2.25rem)
  - Texto: base (1rem)
  - Pequeno: sm (0.875rem)

### Espaçamento
- Container: max-w-7xl
- Padding: p-4 (mobile) a p-8 (desktop)
- Gap: gap-4 (pequeno) a gap-8 (grande)

### Componentes

#### Navbar
```tsx
<Navbar />
```
- Navegação principal do site
- Responsivo com menu mobile
- Logo animado
- Links principais

#### Breadcrumbs
```tsx
<Breadcrumbs items={[
  { label: 'Página', href: '/pagina' },
  { label: 'Subpágina' }
]} />
```
- Navegação hierárquica
- Links clicáveis exceto último item
- Responsivo

#### Tooltip
```tsx
<Tooltip content="Texto do tooltip">
  <button>Hover me</button>
</Tooltip>
```
- Informações contextuais
- Posicionamento automático
- Animações suaves

### Funcionalidades

#### Newsletter
- Validação de e-mail
- Proteção contra spam (honeypot)
- Rate limiting (5 requisições/minuto)
- Feedback visual
- Sanitização de inputs

#### Mapa Interativo
- Google Maps embed
- Localização da universidade
- Responsivo
- Lazy loading

#### Chat
- Widget Tawk.to
- Atendimento em tempo real
- Personalizável

#### Redes Sociais
- Ícones SVG otimizados
- Links externos
- Tooltips informativos
- Acessibilidade

### Animações
- Framer Motion
- Transições suaves
- Feedback visual
- Performance otimizada

### Responsividade
- Mobile First
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

### Acessibilidade
- ARIA labels
- Navegação por teclado
- Contraste adequado
- Textos alternativos

### Performance
- Lazy loading de imagens
- Otimização de SVG
- Sanitização de inputs
- Rate limiting

### Segurança
- Validação de formulários
- Proteção contra spam
- Sanitização de dados
- HTTPS

## Estrutura de Arquivos
```
app/
  ├── api/           # Endpoints da API
  ├── components/    # Componentes reutilizáveis
  ├── contato/       # Página de contato
  ├── eventos/       # Página de eventos
  ├── noticias/      # Página de notícias
  ├── sobre/         # Página sobre
  └── layout.tsx     # Layout principal
```

## Scripts Disponíveis
```bash
npm run dev     # Desenvolvimento
npm run build   # Build de produção
npm run start   # Iniciar produção
npm run lint    # Linting
```

## Dependências Principais
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- TypeScript
- Lucide Icons 