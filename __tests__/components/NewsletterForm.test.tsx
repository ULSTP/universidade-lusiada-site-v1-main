import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterForm from '@/app/sobre/page';

// Mock do fetch
global.fetch = jest.fn();

describe('NewsletterForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renderiza o formulário corretamente', () => {
    render(<NewsletterForm />);
    
    expect(screen.getByPlaceholderText('Seu e-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /inscrever-se/i })).toBeInTheDocument();
  });

  it('valida e-mail inválido', async () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Seu e-mail');
    const submitButton = screen.getByRole('button', { name: /inscrever-se/i });

    await userEvent.type(emailInput, 'email-invalido');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Por favor, insira um e-mail válido.')).toBeInTheDocument();
  });

  it('envia formulário com sucesso', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Seu e-mail');
    const submitButton = screen.getByRole('button', { name: /inscrever-se/i });

    await userEvent.type(emailInput, 'teste@exemplo.com');
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Enviando...');

    await waitFor(() => {
      expect(screen.getByText('Inscrição realizada com sucesso!')).toBeInTheDocument();
    });
  });

  it('trata erro de rede', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Erro de rede'));

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Seu e-mail');
    const submitButton = screen.getByRole('button', { name: /inscrever-se/i });

    await userEvent.type(emailInput, 'teste@exemplo.com');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro de conexão.')).toBeInTheDocument();
    });
  });

  it('detecta spam através do honeypot', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Spam detectado.' })
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Seu e-mail');
    const submitButton = screen.getByRole('button', { name: /inscrever-se/i });

    await userEvent.type(emailInput, 'teste@exemplo.com');
    // Simula preenchimento do honeypot (que não deveria acontecer)
    const honeypotInput = document.querySelector('input[type="text"]');
    if (honeypotInput) {
      await userEvent.type(honeypotInput, 'spam');
    }
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Spam detectado.')).toBeInTheDocument();
    });
  });
}); 