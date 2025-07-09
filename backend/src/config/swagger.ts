import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './environment';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Universidade Lusíada',
      version: '1.0.0',
      description: `
        API RESTful para o Sistema de Gestão Universitária da Universidade Lusíada de São Tomé e Príncipe.
        
        ## Funcionalidades
        - 🔐 **Autenticação JWT** - Sistema de login seguro
        - 👥 **Gestão de Usuários** - CRUD completo com diferentes tipos de usuário
        - 📚 **Sistema Académico** - Cursos, disciplinas, matrículas e notas
        - 💰 **Sistema Financeiro** - Propinas e pagamentos
        - 📄 **Documentos** - Gestão de documentos académicos
        - 📊 **Relatórios** - Estatísticas e dashboards
        
        ## Tipos de Usuário
        - **ADMIN** - Acesso total ao sistema
        - **PROFESSOR** - Gestão de turmas e notas
        - **ESTUDANTE** - Acesso aos próprios dados académicos
        - **FUNCIONARIO** - Operações administrativas específicas
        
        ## Autenticação
        Utilize o endpoint \`/auth/login\` para obter um token JWT.
        Em seguida, inclua o token no header: \`Authorization: Bearer {token}\`
      `,
      contact: {
        name: 'Suporte Técnico',
        email: 'suporte@ulstp.ac.st',
        url: 'https://ulstp.ac.st'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}/api/${config.api.version}`,
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: `https://api.ulstp.ac.st/api/${config.api.version}`,
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint de login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Mensagem de erro'
                },
                code: {
                  type: 'string',
                  description: 'Código do erro'
                },
                details: {
                  type: 'object',
                  description: 'Detalhes adicionais do erro'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            path: {
              type: 'string',
              description: 'Endpoint onde ocorreu o erro'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Dados da resposta'
            },
            message: {
              type: 'string',
              description: 'Mensagem de sucesso'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Página atual'
                },
                limit: {
                  type: 'integer',
                  description: 'Limite de itens por página'
                },
                total: {
                  type: 'integer',
                  description: 'Total de itens'
                },
                pages: {
                  type: 'integer',
                  description: 'Total de páginas'
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome completo'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único'
            },
            tipoUsuario: {
              type: 'string',
              enum: ['ADMIN', 'PROFESSOR', 'ESTUDANTE', 'FUNCIONARIO'],
              description: 'Tipo de usuário'
            },
            estado: {
              type: 'string',
              enum: ['ATIVO', 'INATIVO', 'SUSPENSO', 'BLOQUEADO'],
              description: 'Status do usuário'
            },
            genero: {
              type: 'string',
              enum: ['MASCULINO', 'FEMININO', 'OUTRO'],
              description: 'Gênero'
            },
            dataNascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento'
            },
            telefone: {
              type: 'string',
              description: 'Número de telefone'
            },
            numeroEstudante: {
              type: 'string',
              description: 'Número de matrícula (apenas estudantes)'
            },
            numeroFuncionario: {
              type: 'string',
              description: 'Número de funcionário'
            },
            avatar: {
              type: 'string',
              description: 'URL da foto de perfil'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acesso requerido ou inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  message: 'Token de acesso requerido',
                  code: 'UNAUTHORIZED'
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/users'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Acesso negado - permissões insuficientes',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  message: 'Acesso negado. Permissões insuficientes',
                  code: 'FORBIDDEN'
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/users'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  message: 'Usuário não encontrado',
                  code: 'NOT_FOUND'
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/users/123'
              }
            }
          }
        },
        ValidationError: {
          description: 'Erro de validação dos dados',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  message: 'Dados de entrada inválidos',
                  code: 'VALIDATION_ERROR',
                  details: [
                    {
                      field: 'email',
                      message: 'Email deve ter um formato válido'
                    }
                  ]
                },
                timestamp: '2024-01-15T10:30:00Z',
                path: '/api/v1/users'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para login, logout e gestão de tokens'
      },
      {
        name: 'Usuários',
        description: 'CRUD de usuários do sistema'
      },
      {
        name: 'Cursos',
        description: 'Gestão de cursos académicos'
      },
      {
        name: 'Disciplinas',
        description: 'Gestão de disciplinas'
      },
      {
        name: 'Matrículas',
        description: 'Sistema de matrículas'
      },
      {
        name: 'Notas',
        description: 'Sistema de avaliação e notas'
      },
      {
        name: 'Financeiro',
        description: 'Gestão de propinas e pagamentos'
      },
      {
        name: 'Dashboard',
        description: 'Estatísticas e relatórios'
      },
      {
        name: 'Notificações',
        description: 'Sistema de notificações'
      },
      {
        name: 'Documentos',
        description: 'Gestão de documentos académicos'
      }
    ]
  },
  apis: [
    './src/controllers/**/*.ts', // Buscar comentários swagger nos controllers
    './src/routes/**/*.ts'       // Buscar comentários swagger nas rotas
  ]
};

export const swaggerSpec = swaggerJSDoc(options); 