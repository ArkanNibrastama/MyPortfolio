// --- Project Slider (3D Circular / Coverflow) ---
function initProjectSlider() {
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (cards.length === 0) return;

    let currentIndex = 0; // Start at the first card

    // Create Dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        cards.forEach((card, index) => {
            const offset = index - currentIndex;
            
            // Core 3D Logic
            if (offset === 0) {
                // Active Center Card
                card.className = 'project-card active';
                card.style.transform = `translateX(0) scale(1) rotateY(0deg)`;
                card.style.zIndex = 10;
                card.style.opacity = 1;
                card.style.pointerEvents = 'auto'; // Interactive
            } else {
                // Side Cards
                card.className = 'project-card';
                const sign = Math.sign(offset);
                const absOffset = Math.abs(offset);
                
                // Distances
                const translateX = sign * (350 + (absOffset * 50)); // Stack them with overlap
                const rotateY = sign * -25; // Rotate inwards
                const scale = 1 - (absOffset * 0.15); // Shrink further away
                const zIndex = 10 - absOffset;
                const opacity = absOffset > 2 ? 0 : 1 - (absOffset * 0.3); // Fade out far ones

                card.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
                card.style.zIndex = zIndex;
                card.style.opacity = opacity;
                card.style.pointerEvents = 'none'; // Prevent clicking side cards
            }
        });
        
        // Update dots
        dots.forEach(d => d.classList.remove('active'));
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        
        // Update buttons
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = currentIndex === cards.length - 1 ? '0.5' : '1';
        nextBtn.style.pointerEvents = currentIndex === cards.length - 1 ? 'none' : 'auto';
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Allow clicking side cards to navigate to them
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (currentIndex !== index) {
                goToSlide(index);
            }
        });
    });

    // Initialize
    updateSlider();
}

// --- Clipboard Copy Functionality ---
function initClipboard() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-clipboard-text');
            const originalIcon = btn.innerHTML;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Success State
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i>';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalIcon;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });
}

// Call this in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileNav();
    initSmoothScroll();
    initScrollAnimations();
        initPipelineAnimation(); 
        initSkillsAnimation(); // New Skills Animation
        initProjectSlider();
        initClipboard(); 
        initCopyrightYear();
    });
    
    // --- Skills Animation (Constellation / Neural Network) ---
    function initSkillsAnimation() {
        const canvas = document.getElementById('skills-canvas');
        if (!canvas) return;
    
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Configuration
        const PARTICLE_COUNT = 60;
        const CONNECT_DISTANCE = 120;
        
        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
            createParticles();
        }
    
        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1
                });
            }
        }
    
        function getThemeColors() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            return {
                particle: isDark ? 'rgba(96, 165, 250, 0.5)' : 'rgba(37, 99, 235, 0.4)',
                line: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.15)'
            };
        }
    
        function draw() {
            ctx.clearRect(0, 0, width, height);
            const colors = getThemeColors();
            
            // Update positions
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
    
                // Bounce
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            });
    
            // Draw Connections
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
    
                    if (dist < CONNECT_DISTANCE) {
                        ctx.beginPath();
                        ctx.strokeStyle = colors.line;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
    
            // Draw Particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.fillStyle = colors.particle;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
    
            requestAnimationFrame(draw);
        }
    
        window.addEventListener('resize', resize);
        resize();
        draw();
    }
    
// --- Dynamic Copyright Year ---
function initCopyrightYear() {
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// --- Project Slider (3D Circular / Coverflow) ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Toggle icon
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');

        // Trigger a redraw of the canvas color if needed (handled in animation loop via CSS var check)
    });
}

// --- Mobile Navigation ---
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// --- Smooth Scroll & Active Link ---
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Link Highlighter with IntersectionObserver
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Active when section is near top/middle
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add to current
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// --- Scroll Animations ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15, // Trigger a bit later for better effect
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .stat, .hero-content, .contact-text-area, .contact-card, .spotlight-content');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// --- Data Pipeline Animation (Canvas) ---
function initPipelineAnimation() {
    const canvas = document.getElementById('pipeline-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let packets = [];
    
    // Configuration
    const LAYER_COUNT = 5; // Source -> Ingest -> Process -> Store -> Sink
    const NODES_PER_LAYER = 4;
    const PACKET_CHANCE = 0.05; // Chance per frame to spawn at source
    
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        createPipeline();
    }

    function createPipeline() {
        nodes = [];
        const layerWidth = width / (LAYER_COUNT + 1);
        const layerHeight = height / (NODES_PER_LAYER + 1);

        for (let l = 0; l < LAYER_COUNT; l++) {
            for (let n = 0; n < NODES_PER_LAYER; n++) {
                // Add some randomness to position so it's not a boring perfect grid
                const randomX = (Math.random() - 0.5) * layerWidth * 0.4;
                const randomY = (Math.random() - 0.5) * layerHeight * 0.4;
                
                nodes.push({
                    x: (l + 1) * layerWidth + randomX,
                    y: (n + 1) * layerHeight + randomY,
                    layer: l, // 0 = Source, 4 = Sink
                    id: `${l}-${n}`,
                    radius: 4,
                    connections: [] // Store valid forward connections
                });
            }
        }

        // Create Connections (Left -> Right only)
        nodes.forEach(node => {
            if (node.layer < LAYER_COUNT - 1) {
                // Connect to 1-2 nodes in the next layer
                const nextLayerNodes = nodes.filter(n => n.layer === node.layer + 1);
                // Connect to closest nodes in next layer to avoid messy crossing lines
                nextLayerNodes.sort((a, b) => Math.abs(a.y - node.y) - Math.abs(b.y - node.y));
                
                // Always connect to the closest one, maybe the second closest
                node.connections.push(nextLayerNodes[0]);
                if (Math.random() > 0.5) node.connections.push(nextLayerNodes[1]);
            }
        });
    }

    // Get current colors from CSS variables
    function getColors() {
        const style = getComputedStyle(document.documentElement);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            node: isDark ? '#60a5fa' : '#2563eb',
            line: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)',
            packet: isDark ? '#fbbf24' : '#f59e0b', // Gold/Orange
            glow: isDark ? 'rgba(251, 191, 36, 0.6)' : 'rgba(245, 158, 11, 0.6)'
        };
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const colors = getColors();

        // 1. Draw Static Connections (Pipes)
        ctx.lineCap = 'round';
        nodes.forEach(node => {
            node.connections.forEach(target => {
                // Outer Pipe
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = colors.line;
                ctx.lineWidth = 4;
                ctx.stroke();
                
                // Inner Hollow Detail
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        });

        // 2. Draw Nodes (Infrastructure)
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors.node;
            ctx.fill();
            
            // Label Sources and Sinks briefly
            if (node.layer === 0) { // Source
                 ctx.fillStyle = colors.node;
                 ctx.font = '10px Fira Code';
                 // ctx.fillText("SRC", node.x - 25, node.y + 3);
            }
        });

        // 3. Manage & Draw Packets (Data Flow)
        
        // Spawn new packets at Source Layer (Layer 0)
        if (Math.random() < PACKET_CHANCE) {
            const sourceNodes = nodes.filter(n => n.layer === 0);
            const startNode = sourceNodes[Math.floor(Math.random() * sourceNodes.length)];
            if (startNode.connections.length > 0) {
                 const targetNode = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
                 packets.push({
                     x: startNode.x,
                     y: startNode.y,
                     target: targetNode,
                     currentLayer: 0,
                     speed: 0.02,
                     progress: 0
                 });
            }
        }

        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.progress += p.speed;
            
            // Calculate current position
            const currentX = p.x + (p.target.x - p.x) * p.progress;
            const currentY = p.y + (p.target.y - p.y) * p.progress;

            // Draw Packet
            ctx.beginPath();
            ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
            ctx.fillStyle = colors.packet;
            ctx.fill();
            
            // Trail / Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = colors.glow;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Handle Reaching Destination
            if (p.progress >= 1) {
                // If there are more connections, continue!
                if (p.target.connections.length > 0) {
                    const nextTarget = p.target.connections[Math.floor(Math.random() * p.target.connections.length)];
                    p.x = p.target.x;
                    p.y = p.target.y;
                    p.target = nextTarget;
                    p.progress = 0;
                    p.currentLayer++;
                } else {
                    // Reached Sink (End of pipeline), remove packet
                    packets.splice(i, 1);
                }
            }
        }

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    
    // Mouse Interaction
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    draw();

    // Hero Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
    });
}
