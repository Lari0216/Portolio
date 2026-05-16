// ═══════════════════════════════════════════
// FUNÇÃO GLOBAL: fecha todos os overlays
// (usada pelos links do ov-navbar)
// ═══════════════════════════════════════════
function closeAllOverlays() {
    const overlays = [
        'trimestre-escolha-overlay',
        'materias-overlay',
        'atividade-overlay',
        'album-overlay',
        'trimestre-overlay',
    ];
    overlays.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('overlay-hidden');
            el.classList.remove('overlay-visible');
        }
    });
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════
    // 1. NAVBAR: EFEITO DE SCROLL
    // ═══════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ═══════════════════════════════════════════
    // 2. BOTÃO VOLTAR AO TOPO
    // ═══════════════════════════════════════════
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ═══════════════════════════════════════════
    // 3. ANIMAÇÕES DE ENTRADA (IntersectionObserver)
    // ═══════════════════════════════════════════
    const revealTargets = [
        ...document.querySelectorAll('.album-item'),
        ...document.querySelectorAll('.curriculo-block'),
        ...document.querySelectorAll('.social-circle'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.portfolio-card'),
        ...document.querySelectorAll('.extras-card'),
    ];
    revealTargets.forEach((el, i) => {
        el.classList.add('reveal', `reveal-d${(i % 4) + 1}`);
    });
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════
    // 4. PARALLAX LEVE NO HERO
    // ═══════════════════════════════════════════
    const heroVinyl = document.querySelector('.vinyl-hero-disc');
    window.addEventListener('scroll', () => {
        if (heroVinyl && window.scrollY < window.innerHeight) {
            heroVinyl.style.transform = `translateX(-50%) rotate(${window.scrollY * 0.06}deg)`;
        }
    }, { passive: true });

    // ═══════════════════════════════════════════
    // 5. DISCO HERO: pausar quando fora da tela
    // ═══════════════════════════════════════════
    const heroDisc = document.querySelector('.vinyl-hero-disc');
    if (heroDisc) {
        const discObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                heroDisc.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        });
        discObserver.observe(heroDisc);
    }

    // ═══════════════════════════════════════════
    // 6. BARRA DO PLAYER — progresso visual simulado
    // ═══════════════════════════════════════════
    const barFill = document.getElementById('player-bar-fill');
    if (barFill) {
        let pct = 5;
        setInterval(() => {
            pct = (pct + 0.2) % 100;
            barFill.style.width = pct + '%';
        }, 120);
    }

    // ═══════════════════════════════════════════
    // 7. ÁLBUNS DE ÁREAS (Ensino Médio) → player overlay
    // ═══════════════════════════════════════════
    const albumItems       = document.querySelectorAll('.album-item');
    const albumOverlay     = document.getElementById('album-overlay');
    const playerSleeve     = document.getElementById('player-sleeve');
    const playerVinylLabel = document.getElementById('player-vinyl-label');
    const playerTitle      = document.getElementById('player-title');
    const playerCat        = document.getElementById('player-cat');
    const closeAlbum       = document.getElementById('close-album');

    let currentSubject = '';
    let currentColor   = '';

    function openPlayer(item) {
        const title     = item.getAttribute('data-title');
        const colorAttr = item.getAttribute('data-color') || '#D4AF37,#8B6914';
        const colors    = colorAttr.split(',');
        currentSubject  = title;
        currentColor    = colors[0];

        playerTitle.textContent = title.toUpperCase();
        playerCat.textContent   = '— Ensino Médio';
        playerSleeve.style.background = `linear-gradient(145deg, ${colors[0]}, ${colors[1] || colors[0]})`;
        playerVinylLabel.style.background = colors[0];

        document.body.style.overflow = 'hidden';
        albumOverlay.classList.remove('overlay-hidden');
        albumOverlay.classList.add('overlay-visible');
    }

    albumItems.forEach(item => {
        item.addEventListener('click', () => openPlayer(item));
    });

    closeAlbum.addEventListener('click', () => {
        albumOverlay.classList.add('overlay-hidden');
        albumOverlay.classList.remove('overlay-visible');
        document.body.style.overflow = '';
    });

    // ═══════════════════════════════════════════
    // 8. TRACKLIST do player → overlay trimestre (ens. médio)
    // ═══════════════════════════════════════════
    const trackItems       = document.querySelectorAll('.track-item');
    const trimestreOverlay = document.getElementById('trimestre-overlay');
    const trimestreTitle   = document.getElementById('trimestre-title');
    const trimestreSubject = document.getElementById('trimestre-subject');
    const closeTrim        = document.getElementById('close-trimestre');

    trackItems.forEach(track => {
        track.addEventListener('click', () => {
            const num     = track.getAttribute('data-track');
            const ordinal = num === '1' ? '1°' : num === '2' ? '2°' : '3°';
            trimestreTitle.textContent   = `${ordinal} Trimestre`;
            trimestreSubject.textContent = currentSubject;
            trimestreOverlay.style.borderTop = `4px solid ${currentColor}`;

            albumOverlay.classList.add('overlay-hidden');
            albumOverlay.classList.remove('overlay-visible');
            trimestreOverlay.classList.remove('overlay-hidden');
            trimestreOverlay.classList.add('overlay-visible');
        });
    });

    closeTrim.addEventListener('click', () => {
        trimestreOverlay.classList.add('overlay-hidden');
        trimestreOverlay.classList.remove('overlay-visible');
        albumOverlay.classList.remove('overlay-hidden');
        albumOverlay.classList.add('overlay-visible');
        trimestreOverlay.scrollTop = 0;
    });

    // ═══════════════════════════════════════════
    // 9. CURSO TÉCNICO — disco grande abre escolha de trimestre
    // ═══════════════════════════════════════════
    const tecnicoHeroDisc         = document.getElementById('tecnico-hero-disc');
    const trimestreEscolhaOverlay = document.getElementById('trimestre-escolha-overlay');
    const closeEscolha            = document.getElementById('close-trim-escolha');

    if (tecnicoHeroDisc) {
        tecnicoHeroDisc.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
            trimestreEscolhaOverlay.classList.remove('overlay-hidden');
            trimestreEscolhaOverlay.classList.add('overlay-visible');
        });
    }
    if (closeEscolha) {
        closeEscolha.addEventListener('click', () => {
            trimestreEscolhaOverlay.classList.add('overlay-hidden');
            trimestreEscolhaOverlay.classList.remove('overlay-visible');
            document.body.style.overflow = '';
        });
    }

    function buildSubjectsList(trimestre) {
        matsSubjectList.innerHTML = ''; // Limpa a lista atual
        const subjects = trimestresData[trimestre] || [];

        subjects.forEach((subj, index) => {
            const div = document.createElement('div');
            div.className = 'mats-subject';
            if (index === 0) div.classList.add('active'); // O primeiro item começa ativo
            div.setAttribute('data-subject-index', index);
            
            div.innerHTML = `
                <span class="mats-subject-num">${String(index + 1).padStart(2, '0')}</span>
                <span class="mats-subject-name">${subj.name}</span>
            `;

            // Adiciona o evento de clique na matéria recém-criada
            div.addEventListener('click', () => {
                const allSubjects = document.querySelectorAll('.mats-subject');
                allSubjects.forEach(s => s.classList.remove('active'));
                div.classList.add('active');
                updateMatActivities(index);
            });

            matsSubjectList.appendChild(div);
        });

        // Após construir a lista, se houver matérias, mostra os dados da primeira
        if (subjects.length > 0) {
            updateMatActivities(0);
        } else {
             // Caso não tenha matérias cadastradas para o trimestre ainda
             matsSelectedTitle.textContent = "Nenhuma matéria cadastrada";
             document.getElementById('mats-activities-list').innerHTML = '';
             matsVinylIcon.textContent = '';
        }
    }

    // ═══════════════════════════════════════════
    // 10. TRIMESTRE DISCOS → abre overlay de matérias
    // ═══════════════════════════════════════════
    const trimDiscItems    = document.querySelectorAll('.trim-disc-item');
    const materiasOverlay  = document.getElementById('materias-overlay');
    const matsTrimestreLabel = document.getElementById('mats-trimestre-label');
    const closeMaterias    = document.getElementById('close-materias');
    const matsSubjectList = document.querySelector('.mats-subject-list'); // Seleciona o container das matérias na esquerda

    trimDiscItems.forEach(disc => {
        disc.addEventListener('click', () => {
            const num = disc.getAttribute('data-trim');
            // 2° e 3° estão bloqueados — não faz nada
            if (num !== '1') return;

            const ordinal = '1°';
            matsTrimestreLabel.textContent = `${ordinal} TRIMESTRE`;
            currentTrimestre = num;
            buildSubjectsList(currentTrimestre);

            trimestreEscolhaOverlay.classList.add('overlay-hidden');
            trimestreEscolhaOverlay.classList.remove('overlay-visible');
            materiasOverlay.classList.remove('overlay-hidden');
            materiasOverlay.classList.add('overlay-visible');
        });
    });

    // ═══════════════════════════════════════════
    // 11. MATÉRIAS: troca seleção e disco
    // ═══════════════════════════════════════════
    const matsSubjects   = document.querySelectorAll('.mats-subject');
    const matsVinylLabel = document.getElementById('mats-vinyl-label');
    const matsVinylIcon  = document.getElementById('mats-vinyl-icon');
    const matsSelectedTitle = document.getElementById('mats-selected-title');

    // ═══════════════════════════════════════════
    // DADOS POR MATÉRIA — cada matéria tem tri1, tri2, tri3 próprios
    // EDITE AQUI para adicionar atividades sem afetar outras matérias
    // ═══════════════════════════════════════════
    const subjectData = [
      {
        name: 'Modelagem de Sistemas',
        color: 'radial-gradient(circle, #8b0000, #000)',
        tri1: [
            { 
                title: 'S.A. Modelagem de Sistemas', 
                desc: 'Desenvolvimento completo de uma empresa fictícia de energia solar. O projeto uniu regras de negócios e tecnologia, indo desde a identidade visual e público-alvo até a documentação técnica (diagramas UML e requisitos), finalizado com um pitch de vendas.', 
                img: 'https://www.canva.com/design/DAHEiMlngjI/JHzOzP0tJghXZUUKE24G7g/view?embed' // Link de Modelagem
            },
            {  
                title: 'Grand Prix', 
                desc: 'Participei de um desafio em equipe no SENAI onde tivemos poucos dias para resolver um problema real da indústria. Nós contextualizamos a situação e desenvolvemos um sistema de integração roteirizado para um porto.', 
                img: 'https://www.canva.com/design/DAHHzzkFiGE/0PovBXwvNQzaDWsAE7fESw/view?embed' // Link de Modelagem
            }
        ]
    },
        {
            name: 'Banco de Dados',
            color: 'radial-gradient(circle,#1a5200,#0d3a00)',
            tri1: [
                { title: 'Grand Prix', 
                desc: 'Participei de um desafio em equipe no SENAI onde tivemos poucos dias para resolver um problema real da indústria. Nós contextualizamos a situação e desenvolvemos um sistema de integração roteirizado para um porto.',       
                img: 'https://www.canva.com/design/DAHHzzkFiGE/0PovBXwvNQzaDWsAE7fESw/view?embed' },

            ],
            tri2: [],
            tri3: [],
        },
        {
            name: 'IoT',
            color: 'radial-gradient(circle,#1a3a8e,#0a1a4e)',
            tri1: [
                { title: 'Grand Prix',  
                desc: 'Participei de um desafio em equipe no SENAI onde tivemos poucos dias para resolver um problema real da indústria. Nós contextualizamos a situação e desenvolvemos um sistema de integração roteirizado para um porto.',    
                img: 'https://www.canva.com/design/DAHHzzkFiGE/0PovBXwvNQzaDWsAE7fESw/view?embed' },
                { title: 'Problemas no Cotidiano',   
                desc: 'Identificação de um problema do dia a dia e desenvolvimento de uma solução prática utilizando Internet das Coisas (IoT).',     
                img: 'https://www.canva.com/design/DAHBG41dCTQ/BzNPwjlr6x9ZtiTYDz6-mA/view?embed' },
            ],
            tri2: [],
            tri3: [],
        },
    ];

    // Trimestre atual selecionado (1, 2 ou 3)
    let currentTrimestre = '1';

    // Monta a lista de matérias no overlay para o trimestre clicado
    function buildSubjectsList(trim) {
        matsSubjectList.innerHTML = '';
        subjectData.forEach((subj, index) => {
            const div = document.createElement('div');
            div.className = 'mats-subject' + (index === 0 ? ' active' : '');
            div.setAttribute('data-subject-index', index);
            div.innerHTML = `
                <span class="mats-subject-num">${String(index + 1).padStart(2, '0')}</span>
                <span class="mats-subject-name">${subj.name}</span>`;
            div.addEventListener('click', () => {
                document.querySelectorAll('.mats-subject').forEach(s => s.classList.remove('active'));
                div.classList.add('active');
                updateMatActivities(index);
            });
            matsSubjectList.appendChild(div);
        });
        updateMatActivities(0);
    }

    function updateMatActivities(index) {
        const subj    = subjectData[index];
        if (!subj) return;

        matsSelectedTitle.textContent = subj.name;
        if (matsVinylLabel) matsVinylLabel.style.background = subj.color;

        // Pega as atividades do trimestre atual
        const triKey     = 'tri' + currentTrimestre;
        const activities = subj[triKey] || [];

        const list = document.getElementById('mats-activities-list');
        list.innerHTML = '';

        if (activities.length === 0) {
            list.innerHTML = '<p style="color:rgba(212,175,55,.4);font-size:.78rem;letter-spacing:2px;margin-top:16px;font-family:var(--font-body)">EM ANDAMENTO</p>';
            return;
        }

        activities.forEach((act, i) => {
            const div = document.createElement('div');
            div.className = 'mats-activity-item';
            div.setAttribute('data-activity', i);
            div.innerHTML = `<span class="mats-act-icon">🔷</span><span>${String(i+1).padStart(2,'0')}. ${act.title}</span>`;
            // Passa os dados completos da atividade para o overlay
            div.addEventListener('click', () => openAtividadeOverlay(i, {
                name:       subj.name,
                activities: activities.map(a => a.title),
                actData:    activities,
            }));
            list.appendChild(div);
        });
    }

    matsSubjects.forEach(subj => {
        subj.addEventListener('click', () => {
            matsSubjects.forEach(s => s.classList.remove('active'));
            subj.classList.add('active');
            const idx = parseInt(subj.getAttribute('data-subject-index'));
            updateMatActivities(idx);
        });
    });

    // A lista de matérias é construída ao clicar num trimestre (buildSubjectsList)

    // ═══════════════════════════════════════════
    // 12. ATIVIDADE: carrossel fullscreen
    // ═══════════════════════════════════════════
    const atividadeOverlay = document.getElementById('atividade-overlay');
    const closeAtividade   = document.getElementById('close-atividade');
    const atvPrev          = document.getElementById('atv-prev');
    const atvNext          = document.getElementById('atv-next');
    const atvCounter       = document.getElementById('atv-counter');
    const atvDotsRow       = document.getElementById('atv-dots');
    const atvTag           = document.getElementById('atv-tag');
    const atvTitle         = document.getElementById('atv-title');
    const atvDesc          = document.getElementById('atv-desc');

    let currentActivityIndex = 0;
    let currentSubjectData   = null;

    function openAtividadeOverlay(index, data) {
        currentActivityIndex = index;
        currentSubjectData   = data;
        renderAtividadeSlide();

        materiasOverlay.classList.add('overlay-hidden');
        materiasOverlay.classList.remove('overlay-visible');
        atividadeOverlay.classList.remove('overlay-hidden');
        atividadeOverlay.classList.add('overlay-visible');
    }

    function renderAtividadeSlide() {
        const data     = currentSubjectData;
        const actList  = data.actData || data.activities.map(t => ({ title: t, desc: `Desenvolvida durante o curso técnico — ${data.name}.`, img: '' }));
        const total    = actList.length;
        const act      = actList[currentActivityIndex] || { title: data.activities[currentActivityIndex] || '', desc: '', img: '' };

        atvTag.textContent     = `ATIVIDADE ${String(currentActivityIndex + 1).padStart(2, '0')}`;
        atvTitle.textContent   = (act.title || act).replace(/^\d+\.\s*/, '');
        atvDesc.textContent    = act.desc || `Desenvolvida durante o curso técnico — ${data.name}.`;
        atvCounter.textContent = `${currentActivityIndex + 1} / ${total}`;

        // Imagem ou placeholder
// Imagem, Canva ou placeholder
        const imgArea = document.querySelector('.atv-image-area');
      if (imgArea) {
            if (act.img && act.img.includes('canva.com')) {
                // Se for link do Canva, cria o player
                imgArea.innerHTML = `
                  <div style="position: relative; width: 100%; height: 100%; min-height: 300px; overflow: hidden; border-radius: 8px;">
                    <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;" src="${act.img}" allowfullscreen="allowfullscreen" allow="fullscreen"></iframe>
                  </div>`;
            } else if (act.img) {
                // Se for uma foto normal
                imgArea.innerHTML = `<img src="${act.img}" alt="${act.title}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">`;
            } else {
                // Se estiver vazio
                imgArea.innerHTML = `<div class="atv-image-placeholder"><span>Imagem da Atividade</span><small>Adicione sua imagem aqui</small></div>`;
            }
        }
        // Dots
        atvDotsRow.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'atv-dot' + (i === currentActivityIndex ? ' active' : '');
            dot.addEventListener('click', () => { currentActivityIndex = i; renderAtividadeSlide(); });
            atvDotsRow.appendChild(dot);
        }
    }

    if (atvPrev) {
        atvPrev.addEventListener('click', () => {
            const total = currentSubjectData.activities.length;
            currentActivityIndex = (currentActivityIndex - 1 + total) % total;
            renderAtividadeSlide();
        });
    }
    if (atvNext) {
        atvNext.addEventListener('click', () => {
            const total = currentSubjectData.activities.length;
            currentActivityIndex = (currentActivityIndex + 1) % total;
            renderAtividadeSlide();
        });
    }
    if (closeAtividade) {
        closeAtividade.addEventListener('click', () => {
            atividadeOverlay.classList.add('overlay-hidden');
            atividadeOverlay.classList.remove('overlay-visible');
            // Volta para o overlay de matérias (página anterior)
            materiasOverlay.classList.remove('overlay-hidden');
            materiasOverlay.classList.add('overlay-visible');
        });
    }
    // Botão X (agora "← VOLTAR") — mesmo comportamento: volta para matérias
    const closeAtividadeX = document.getElementById('close-atividade-x');
    if (closeAtividadeX) {
        closeAtividadeX.addEventListener('click', () => {
            atividadeOverlay.classList.add('overlay-hidden');
            atividadeOverlay.classList.remove('overlay-visible');
            materiasOverlay.classList.remove('overlay-hidden');
            materiasOverlay.classList.add('overlay-visible');
        });
    }

    // ═══════════════════════════════════════════
    // 13. ATIVIDADES EXTRAS — CARROSSEL
    // ═══════════════════════════════════════════
    const extrasTrack  = document.getElementById('extras-track');
    const extrasPrev   = document.getElementById('extras-prev');
    const extrasNext   = document.getElementById('extras-next');
    const extrasDots   = document.getElementById('extras-dots');

    let extrasIndex    = 0;
    const CARDS_VISIBLE = 3;

    function getExtrasCards() {
        return extrasTrack ? extrasTrack.querySelectorAll('.extras-card') : [];
    }

    function updateExtrasCarousel() {
        const cards = getExtrasCards();
        const total = cards.length;
        const maxIndex = Math.max(0, total - CARDS_VISIBLE);
        extrasIndex = Math.max(0, Math.min(extrasIndex, maxIndex));

        if (!extrasTrack) return;

        const cardWidth = cards[0] ? cards[0].offsetWidth : 280;
        const gap = 24;
        extrasTrack.style.transform = `translateX(-${extrasIndex * (cardWidth + gap)}px)`;

        // Dots
        if (extrasDots) {
            extrasDots.innerHTML = '';
            const dotCount = maxIndex + 1;
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === extrasIndex ? ' active' : '');
                dot.addEventListener('click', () => { extrasIndex = i; updateExtrasCarousel(); });
                extrasDots.appendChild(dot);
            }
        }
    }

    if (extrasPrev) {
        extrasPrev.addEventListener('click', () => { extrasIndex--; updateExtrasCarousel(); });
    }
    if (extrasNext) {
        extrasNext.addEventListener('click', () => { extrasIndex++; updateExtrasCarousel(); });
    }

    // Inicializa após imagens carregarem
    window.addEventListener('load', updateExtrasCarousel);
    window.addEventListener('resize', updateExtrasCarousel);

    // ═══════════════════════════════════════════
    // 14. ESC FECHA QUALQUER OVERLAY
    // ═══════════════════════════════════════════
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        // Fecha na ordem: atividade → matérias → escolha trimestre → player → trimestre EM
        if (!atividadeOverlay.classList.contains('overlay-hidden')) {
            closeAtividade.click();
        } else if (!materiasOverlay.classList.contains('overlay-hidden')) {
            closeMaterias.click();
        } else if (!trimestreEscolhaOverlay.classList.contains('overlay-hidden')) {
            closeEscolha.click();
        } else if (!trimestreOverlay.classList.contains('overlay-hidden')) {
            closeTrim.click();
        } else if (!albumOverlay.classList.contains('overlay-hidden')) {
            closeAlbum.click();
        }
    });

});