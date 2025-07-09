"use client"

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Users, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useSession } from 'next-auth/react';

const CursosPage = () => {
  const { data: session } = useSession();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Buscar cursos da API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        } else if (response.status === 401) {
          setCourses([]);
        } else {
          setError('Erro ao carregar cursos');
        }
      } catch (err) {
        console.error('Erro:', err);
        setError('Erro ao conectar com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filtrar cursos
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Mapear níveis para português
  const getLevelText = (level) => {
    const levels = {
      'BACHELOR': 'Licenciatura',
      'MASTER': 'Mestrado',
      'DOCTORATE': 'Doutoramento',
      'CERTIFICATE': 'Certificado'
    };
    return levels[level] || level;
  };

  // Função para obter ícone baseado no nível
  const getLevelIcon = (level) => {
    switch(level) {
      case 'BACHELOR': return '🎓';
      case 'MASTER': return '🎯';
      case 'DOCTORATE': return '👨‍🎓';
      case 'CERTIFICATE': return '📜';
      default: return '📚';
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full bg-[#1B3159] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Cursos ULSTP
          </h1>
          <p className="text-lg">
            Explore nossos cursos de graduação e pós-graduação
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-96 relative">
              <Input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setSelectedLevel('')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  !selectedLevel 
                    ? 'bg-[#1B3159] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              <button 
                onClick={() => setSelectedLevel('BACHELOR')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedLevel === 'BACHELOR'
                    ? 'bg-[#1B3159] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Licenciatura
              </button>
              <button 
                onClick={() => setSelectedLevel('MASTER')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedLevel === 'MASTER'
                    ? 'bg-[#1B3159] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mestrado
              </button>
              <button 
                onClick={() => setSelectedLevel('DOCTORATE')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedLevel === 'DOCTORATE'
                    ? 'bg-[#1B3159] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Doutoramento
              </button>
              <button 
                onClick={() => setSelectedLevel('CERTIFICATE')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedLevel === 'CERTIFICATE'
                    ? 'bg-[#1B3159] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Certificado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B3159] mx-auto"></div>
              <p className="mt-4 text-gray-600">A carregar cursos...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 mb-4">❌</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar cursos</h3>
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* No Courses Found */}
          {!loading && !error && filteredCourses.length === 0 && courses.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-blue-600 mb-4">📚</div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Nenhum curso encontrado</h3>
                <p className="text-blue-600">Ainda não há cursos cadastrados na base de dados.</p>
                {!session && (
                  <p className="text-sm text-gray-500 mt-2">
                    Faça login para ver todos os cursos disponíveis.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Filtered Results Empty */}
          {!loading && !error && filteredCourses.length === 0 && courses.length > 0 && (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-yellow-600 mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Nenhum curso encontrado</h3>
                <p className="text-yellow-600">Não foram encontrados cursos com os filtros aplicados.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('');
                  }}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">{getLevelIcon(course.level)}</span>
                    </div>
                  </div>
                  
                  {course.description && (
                    <p className="text-gray-600 mb-4">{course.description}</p>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-500">{getLevelText(course.level)}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{course.credits} créditos</span>
                      {course.maxStudents && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">{course.maxStudents} vagas</span>
                        </>
                      )}
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} semestres</span>
                      </div>
                    )}
                  </div>

                  {course.teacher && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Professor: {course.teacher.user?.name || 'N/A'}</span>
                      </div>
                    </div>
                  )}

                  {course.subjects && course.subjects.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Disciplinas ({course.subjects.length}):
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {course.subjects.slice(0, 4).map((subject) => (
                          <span 
                            key={subject.id}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {subject.name}
                          </span>
                        ))}
                        {course.subjects.length > 4 && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                            +{course.subjects.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center">
                    <button className="text-[#1B3159] font-semibold hover:underline">
                      Mais Informações
                    </button>
                    <button className="px-4 py-2 bg-[#1B3159] text-white rounded-md hover:bg-[#152544]">
                      Ver Plano
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Código: {course.code}</span>
                      {course._count && (
                        <span>
                          {course._count.enrollments || 0} alunos inscritos
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics */}
          {!loading && !error && courses.length > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-[#1B3159] text-white rounded-lg p-6 inline-block">
                <h3 className="text-lg font-semibold mb-2">Estatísticas dos Cursos</h3>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div>Total de Cursos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{filteredCourses.length}</div>
                    <div>Cursos Filtrados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {courses.filter(c => c.level === 'BACHELOR').length}
                    </div>
                    <div>Licenciaturas</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Calendário Académico
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Confira as datas importantes do ano letivo
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold mb-6">1º Semestre</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-[#1B3159]"></div>
                  <div>
                    <h4 className="font-semibold">Início das Aulas</h4>
                    <p className="text-gray-600">11 de Setembro, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-[#1B3159]"></div>
                  <div>
                    <h4 className="font-semibold">Avaliações Intermediárias</h4>
                    <p className="text-gray-600">15-20 de Novembro, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-[#1B3159]"></div>
                  <div>
                    <h4 className="font-semibold">Exames Finais</h4>
                    <p className="text-gray-600">15-30 de Janeiro, 2025</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold mb-6">2º Semestre</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-[#1B3159]"></div>
                  <div>
                    <h4 className="font-semibold">Início das Aulas</h4>
                    <p className="text-gray-600">11 de Fevereiro, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-[#1B3159]"></div>
                  <div>
                    <h4 className="font-semibold">Avaliações Intermediárias</h4>
                    <p className="text-gray-600">15-20 de Abril, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-4 h-4 mt-1 rounded-full bg-[#1B3159]"></div>
                  <div>
                    <h4 className="font-semibold">Exames Finais</h4>
                    <p className="text-gray-600">15-30 de Junho, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a 
              href="/" 
              className="text-[#1B3159] font-semibold hover:underline"
            >
              ← Voltar para Página Inicial
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CursosPage; 