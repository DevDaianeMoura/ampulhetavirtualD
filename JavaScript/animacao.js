(function() {
            const ampulheta = document.querySelector('.ampulheta');
            const areiaDescendo = document.querySelector('.ampulheta-areia-descendo');
            const areiaSubindo = document.querySelector('.ampulheta-areia-subindo');
            const iniciarBtn = document.getElementById('iniciar-btn');
            const pausarBtn = document.getElementById('pausar-btn');
            const contadorNumerico = document.getElementById('contador-numerico');
            const tempoInput = document.getElementById('tempo-input');
            const tempoInputContainer = document.getElementById('tempo-input-container');
            const saudacao = document.getElementById('saudacao');
            
            const estado = {
                duracaoTotal: 60,
                segundosRestantes: 60,
                estaContando: false,
                intervaloID: null
            };

            const aplicarAnimacoesAreia = (animacaoDescendo, animacaoSubindo, duracao) => {
                areiaDescendo.style.animation = `${animacaoDescendo} ${duracao}s linear forwards`;
                areiaSubindo.style.animation = `${animacaoSubindo} ${duracao}s linear forwards`;
                areiaDescendo.style.animationPlayState = 'running';
                areiaSubindo.style.animationPlayState = 'running';
            };

            const atualizarContagem = () => {
                estado.segundosRestantes--;
                contadorNumerico.textContent = estado.segundosRestantes;
                if (estado.segundosRestantes <= 0) {
                    clearInterval(estado.intervaloID);
                    saudacao.textContent = 'Sua contagem terminou.';
                    setTimeout(() => {
                        tempoInputContainer.classList.remove('hidden');
                        iniciarBtn.classList.remove('hidden');
                        pausarBtn.textContent = 'Pausar';
                        pausarBtn.classList.add('hidden');
                        saudacao.textContent = '';
                        estado.estaContando = false;
                        ampulheta.classList.remove('virada');
                        areiaDescendo.style.animation = 'none';
                        areiaSubindo.style.animation = 'none';
                    }, 1000);
                }
            };

            const iniciarContagem = () => {
                estado.duracaoTotal = parseInt(tempoInput.value) || 60;
                tempoInput.value = estado.duracaoTotal;
                
                estado.estaContando = true;
                iniciarBtn.classList.add('hidden');
                pausarBtn.classList.remove('hidden');
                tempoInputContainer.classList.add('hidden');
                
                saudacao.textContent = 'Sua contagem começou...';
                estado.segundosRestantes = estado.duracaoTotal;
                contadorNumerico.textContent = estado.segundosRestantes;
                const duracaoDaAreia = estado.duracaoTotal / 2;
                
                aplicarAnimacoesAreia('cairAreia', 'acumularAreia', duracaoDaAreia);
                
                estado.intervaloID = setInterval(atualizarContagem, 1000);
                
                setTimeout(() => {
                    areiaDescendo.style.animation = 'none';
                    areiaSubindo.style.animation = 'none';
                    ampulheta.classList.add('virada');

                    setTimeout(() => {
                        aplicarAnimacoesAreia('acumularAreia', 'cairAreia', duracaoDaAreia);
                    }, 500);
                }, duracaoDaAreia * 1000);
            };

            const togglePause = () => {
                if (estado.estaContando) {
                    clearInterval(estado.intervaloID);
                    areiaDescendo.style.animationPlayState = 'paused';
                    areiaSubindo.style.animationPlayState = 'paused';
                    pausarBtn.textContent = 'Retomar';
                    estado.estaContando = false;
                } else {
                    estado.intervaloID = setInterval(atualizarContagem, 1000);
                    areiaDescendo.style.animationPlayState = 'running';
                    areiaSubindo.style.animationPlayState = 'running';
                    pausarBtn.textContent = 'Pausar';
                    estado.estaContando = true;
                }
            };

            iniciarBtn.addEventListener('click', () => {
                if (!estado.estaContando) iniciarContagem();
            });

            pausarBtn.addEventListener('click', togglePause);
            
            // Atualização: usar Space para pausar/retomar
            document.addEventListener('keydown', (event) => {
                // Espaço para pausa/retomar
                if (event.code === 'Space') {
                    // Evita repetição (Chrome)
                    if (event.repeat) return;
                    // Não agir se o foco estiver no input de tempo
                    if (tempoInput && document.activeElement === tempoInput) return;
                    // Impede o scroll da página
                    event.preventDefault();

                    if (estado.estaContando) {
                        togglePause();
                    } else {
                        iniciarContagem();
                    }
                }

                // Opcional: manter Enter funcionando como alternativa
                // else if (event.code === 'Enter') {
                //     if (event.repeat) return;
                //     if (tempoInput && document.activeElement === tempoInput) return;
                //     event.preventDefault();
                //     if (estado.estaContando) togglePause(); else iniciarContagem();
                // }
            });

            // Carrega o valor inicial no display
            contadorNumerico.textContent = tempoInput.value;
        })();