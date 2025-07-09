@echo off
echo Adicionando PostgreSQL ao PATH do Windows...

:: Adicionar PostgreSQL 17 ao PATH (ajuste a versão se necessário)
set PG_PATH="C:\Program Files\PostgreSQL\17\bin"

:: Verificar se existe
if exist %PG_PATH% (
    echo PostgreSQL encontrado em %PG_PATH%
    
    :: Adicionar ao PATH da sessão atual
    set PATH=%PATH%;%PG_PATH%
    
    echo PATH atualizado para esta sessão!
    echo.
    echo Agora pode usar: psql -U postgres -h localhost
    echo.
    echo Para tornar permanente, execute como Administrador:
    echo setx PATH "%%PATH%%;%PG_PATH%" /M
    
) else (
    echo PostgreSQL não encontrado em %PG_PATH%
    echo Verifique se PostgreSQL está instalado corretamente
    echo Ou ajuste o caminho no script
)

pause 