window.addEventListener('scroll', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        var revealPoint = 150;
        
        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
}

// Run once on load to show cards already in view
reveal();

document.addEventListener('DOMContentLoaded', function() {
    // सभी एनिमेशन वाली क्लासेज को सेलेक्ट करें
    const animatedElements = document.querySelectorAll('.reveal, .reveal-zoom, .reveal-left, .reveal-right');

    // Intersection Observer की सेटिंग (जब एलिमेंट 15% स्क्रीन पर दिखे तब ट्रिगर हो)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // अगर एलिमेंट स्क्रीन पर आ गया है
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); // active क्लास जोड़ें
                observer.unobserve(entry.target); // एक बार एनिमेशन होने के बाद उसे रोक दें
            }
        });
    }, observerOptions);

    // सभी एलिमेंट्स पर ऑब्जर्वर चालू करें
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });
});