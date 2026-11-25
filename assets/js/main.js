document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  burger.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', ouvert);
  });

  // Sous-menu Blog (tactile et clavier)
  const parent = document.querySelector('.has-sub');
  const bascule = parent.querySelector('.sub-toggle');
  const basculer = (ouvert) => {
    parent.classList.toggle('open', ouvert);
    bascule.setAttribute('aria-expanded', ouvert);
  };
  bascule.addEventListener('click', () => basculer(!parent.classList.contains('open')));
  document.addEventListener('click', (e) => { if (!parent.contains(e.target)) basculer(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    basculer(false);
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });

  // Image de remplacement si une photo distante ne se charge pas
  document.querySelectorAll('img').forEach((img) => {
    const remplacer = () => {
      img.onerror = null;
      img.src = 'assets/images/remplacement.svg';
    };
    img.onerror = remplacer;
    if (img.complete && img.naturalWidth === 0 && img.loading !== 'lazy') remplacer();
  });

  // Apparition progressive
  const blocs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.05 });
    blocs.forEach((bloc) => observateur.observe(bloc));
  } else {
    blocs.forEach((bloc) => bloc.classList.add('visible'));
  }

  // Filtres des pages Menu et Blog
  const boutons = document.querySelectorAll('.filtres button');
  boutons.forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const filtre = bouton.dataset.filtre;
      boutons.forEach((b) => b.setAttribute('aria-pressed', b === bouton));
      document.querySelectorAll('[data-categorie]').forEach((element) => {
        element.hidden = filtre !== 'tout' && element.dataset.categorie !== filtre;
        element.classList.add('visible');
      });
    });
  });

  // Validation du formulaire de contact
  const form = document.querySelector('#form-contact');
  if (!form) return;
  const statut = form.querySelector('.statut');
  const regles = {
    nom: (v) => v.length >= 3 ? '' : 'Indiquez votre nom et prénom (3 caractères minimum).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Saisissez une adresse e-mail valide, par exemple awa@exemple.sn.',
    sujet: (v) => v.length >= 3 ? '' : 'Indiquez le sujet (3 caractères minimum).',
    message: (v) => v.length >= 10 ? '' : 'Écrivez un message d’au moins 10 caractères.'
  };
  const verifier = (nom) => {
    const champ = form.elements[nom];
    const message = regles[nom](champ.value.trim());
    champ.setAttribute('aria-invalid', Boolean(message));
    document.getElementById('erreur-' + nom).textContent = message;
    return !message;
  };
  Object.keys(regles).forEach((nom) => {
    const champ = form.elements[nom];
    champ.addEventListener('blur', () => verifier(nom));
    champ.addEventListener('input', () => {
      if (champ.getAttribute('aria-invalid') === 'true') verifier(nom);
    });
  });
  form.addEventListener('submit', (e) => {
    const invalides = Object.keys(regles).filter((nom) => !verifier(nom));
    statut.textContent = '';
    if (invalides.length) {
      e.preventDefault();
      form.elements[invalides[0]].focus();
      statut.textContent = 'Veuillez corriger les champs signalés.';
    } else if (form.action.includes('VOTRE_EMAIL')) {
      e.preventDefault();
      statut.textContent = 'Mode démonstration : les champs sont valides, mais aucun message n’a été envoyé. L’adresse FormSubmit reste à configurer.';
    }
  });
});
