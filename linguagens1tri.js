// linguagens1tri.js — Linguagens | 1° Trimestre
// Arquivo 100% isolado. Alterações aqui não afetam nenhuma outra página.

document.addEventListener('DOMContentLoaded', () => {

    // Pausa animação do disco quando fora da tela
    const vinyl = document.getElementById('trim-vinyl');
    if (vinyl) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                vinyl.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
            });
        });
        obs.observe(vinyl);
    }

    // Destaque ativo nos itens de atividade
    document.querySelectorAll('.ativ-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.ativ-item').forEach(i => i.style.background = '');
            item.style.background = 'rgba(212,175,55,.10)';
        });
    });

});