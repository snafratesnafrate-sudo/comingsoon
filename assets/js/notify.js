/* ── SnaFrate Coming Soon — Notify Form ── */
(function () {

    const input = document.getElementById('email-input');
    const btn   = document.getElementById('notify-btn');
    const toast = document.getElementById('toast');

    function showToast(msg, isError) {
        toast.textContent = msg;
        toast.classList.toggle('error', !!isError);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    async function handleNotify() {
        const val = input.value.trim();

        if (!val || !val.includes('@') || !val.includes('.')) {
            showToast('Please enter a valid email.', true);
            return;
        }

        btn.textContent = 'Sending…';
        btn.disabled    = true;

        try {
            const res = await fetch('/api/notify', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email: val }),
            });

            if (res.ok) {
                showToast("🎉 You're on the list! Check your inbox.");
                input.value = '';
            } else {
                const data = await res.json().catch(() => ({}));
                showToast(data.error || 'Something went wrong. Try again.', true);
            }
        } catch (e) {
            showToast('Network error. Please try again.', true);
        }

        btn.textContent = 'Notify Me';
        btn.disabled    = false;
    }

    // expose to inline onclick
    window.handleNotify = handleNotify;

    // enter key support
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleNotify();
    });

})();
