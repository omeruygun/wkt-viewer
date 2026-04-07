/**
 * Guided tour — first visit + Help button; optional "don't show again".
 */
(function () {
    const STORAGE_SKIP = 'wktviewer_tour_dismissed';

    const PROJECTION_STEP_INDEX = 8;

    const STEP_DEFS = [
        { selector: null },
        { selector: '#mapToolbar' },
        { selector: '#zoomLevel' },
        { selector: '#basemapSwitcher' },
        { selector: '#tourDemoGeometryItem' },
        { selector: '#sidebarFooter' },
        { selector: '#styleModal .modal' },
        { selector: '#tourDemoGeometryItem .geometry-item-actions' },
        { selector: '#projectionModal .modal' },
        { selector: '#tourHelpBtn' }
    ];

    let tourIndex = 0;
    let tourRoot = null;
    let resizeRaf = 0;

    function isMobileLayout() {
        return window.innerWidth <= 768;
    }

    function tourEnsureSidebarOpen() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && isMobileLayout() && !sidebar.classList.contains('open')) {
            if (typeof toggleSidebar === 'function') toggleSidebar();
        }
    }

    function tourEnsureSidebarClosedMobile() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && isMobileLayout() && sidebar.classList.contains('open')) {
            if (typeof closeSidebar === 'function') closeSidebar();
        }
    }

    function tourStep1Before() {
        tourEnsureSidebarOpen();
        if (typeof closeWKTModal === 'function') closeWKTModal();
        if (typeof closeStyleModal === 'function') closeStyleModal();
        if (typeof closeProjectionModal === 'function') closeProjectionModal();
        if (typeof ensureTourDemoGeometry === 'function') {
            ensureTourDemoGeometry();
        }
    }

    function tourSidebarFooterBefore() {
        tourEnsureSidebarOpen();
        if (typeof closeWKTModal === 'function') closeWKTModal();
        if (typeof closeStyleModal === 'function') closeStyleModal();
        if (typeof closeProjectionModal === 'function') closeProjectionModal();
    }

    function tourStyleModalBefore() {
        if (typeof closeWKTModal === 'function') closeWKTModal();
        tourEnsureSidebarOpen();
        if (typeof ensureTourDemoGeometry === 'function') ensureTourDemoGeometry();
        if (typeof setTourDemoPointFill === 'function') setTourDemoPointFill('#D0021B');
        var id = window.wktTourDemoGeometryId;
        if (id != null && typeof openStyleModal === 'function') openStyleModal(id);
        var pc = document.getElementById('pointColor');
        var pch = document.getElementById('pointColorHex');
        if (pc) pc.value = '#1976D2';
        if (pch) pch.value = '#1976D2';
        if (typeof applyStyle === 'function') applyStyle(true);
    }

    function tourGeomActionsBefore() {
        if (typeof closeStyleModal === 'function') closeStyleModal();
        if (typeof closeWKTModal === 'function') closeWKTModal();
        if (typeof closeProjectionModal === 'function') closeProjectionModal();
        tourEnsureSidebarOpen();
    }

    function tourStep4Before() {
        tourEnsureSidebarOpen();
        var id = window.wktTourDemoGeometryId;
        if (id != null && typeof openProjectionModal === 'function') {
            openProjectionModal(id);
        }
    }

    function tourStep5Before() {
        if (typeof closeProjectionModal === 'function') {
            closeProjectionModal();
        }
        if (typeof closeStyleModal === 'function') closeStyleModal();
        if (typeof closeWKTModal === 'function') closeWKTModal();
        tourEnsureSidebarClosedMobile();
    }

    const STEP_BEFORE = [
        null,
        tourEnsureSidebarClosedMobile,
        tourEnsureSidebarClosedMobile,
        tourEnsureSidebarClosedMobile,
        tourStep1Before,
        tourSidebarFooterBefore,
        tourStyleModalBefore,
        tourGeomActionsBefore,
        tourStep4Before,
        tourStep5Before
    ];

    function syncTourModalChrome() {
        if (!tourRoot) return;
        var html = document.documentElement;
        var overlay = tourRoot.querySelector('.tour-overlay');
        var spotlight = tourRoot.querySelector('.tour-spotlight');
        var popover = tourRoot.querySelector('.tour-popover');
        var styleStep = tourIndex === 6;
        var projStep = tourIndex === PROJECTION_STEP_INDEX;
        var modalChrome = styleStep || projStep;

        html.classList.remove('tour-wkt-modal-step', 'tour-style-modal-step', 'tour-projection-step');
        if (styleStep) html.classList.add('tour-style-modal-step');
        if (projStep) html.classList.add('tour-projection-step');

        if (modalChrome) {
            tourRoot.style.zIndex = 'auto';
            if (overlay) overlay.style.display = 'none';
            if (spotlight) spotlight.style.display = 'none';
            if (popover) popover.style.zIndex = '20000';
        } else {
            tourRoot.style.zIndex = '';
            if (overlay) overlay.style.display = '';
            if (spotlight) spotlight.style.display = '';
            if (popover) popover.style.zIndex = '';
        }
    }

    function shouldAutoStartTour() {
        try {
            return localStorage.getItem(STORAGE_SKIP) !== '1';
        } catch (e) {
            return true;
        }
    }

    function dismissTourForever() {
        try {
            localStorage.setItem(STORAGE_SKIP, '1');
        } catch (e) { /* ignore */ }
    }

    function getStepCount() {
        return STEP_DEFS.length;
    }

    function buildPopoverHtml() {
        return (
            '<div class="tour-popover" role="dialog" aria-modal="true" aria-labelledby="tourTitle">' +
            '<button type="button" class="tour-popover__close" id="tourCloseBtn" aria-label="">' +
            '<span class="material-icons">close</span></button>' +
            '<div class="tour-popover__main">' +
            '<div class="tour-popover__progress" id="tourProgress"></div>' +
            '<h3 class="tour-popover__title" id="tourTitle"></h3>' +
            '<p class="tour-popover__body" id="tourBody"></p>' +
            '<label class="tour-popover__skip"><input type="checkbox" id="tourDontShowAgain" /> <span id="tourDontShowLabel"></span></label>' +
            '</div>' +
            '<div class="tour-popover__actions">' +
            '<button type="button" class="btn tour-popover__restart" id="tourRestartBtn"></button>' +
            '<div class="tour-popover__actions-nav">' +
            '<button type="button" class="btn btn-secondary" id="tourPrevBtn"></button>' +
            '<button type="button" class="btn btn-primary" id="tourNextBtn"></button>' +
            '</div></div></div>'
        );
    }

    function updatePopoverTexts() {
        if (!tourRoot) return;
        const i = tourIndex;
        document.getElementById('tourTitle').textContent = t('tour.step' + i + '.title');
        document.getElementById('tourBody').textContent = t('tour.step' + i + '.body');
        document.getElementById('tourProgress').textContent = t('tour.progress', {
            current: String(i + 1),
            total: String(getStepCount())
        });
        document.getElementById('tourDontShowLabel').textContent = t('tour.dontShowAgain');
        document.getElementById('tourRestartBtn').textContent = t('tour.restart');
        document.getElementById('tourRestartBtn').setAttribute('aria-label', t('tour.restart'));
        document.getElementById('tourRestartBtn').setAttribute('title', t('tour.restart'));
        document.getElementById('tourPrevBtn').textContent = t('tour.prev');
        document.getElementById('tourNextBtn').textContent =
            i >= getStepCount() - 1 ? t('tour.done') : t('tour.next');
        document.getElementById('tourCloseBtn').setAttribute('aria-label', t('tour.close'));
        document.getElementById('tourCloseBtn').setAttribute('title', t('tour.closeDetail'));

        const prev = document.getElementById('tourPrevBtn');
        prev.disabled = i === 0;
        prev.style.visibility = 'visible';
        prev.style.opacity = i === 0 ? '0.45' : '1';

        syncTourModalChrome();
    }

    function getTargetRect() {
        const def = STEP_DEFS[tourIndex];
        if (!def || !def.selector) return null;
        const el = document.querySelector(def.selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width < 2 && r.height < 2) return null;
        const pad = 8;
        return {
            top: r.top - pad,
            left: r.left - pad,
            width: r.width + pad * 2,
            height: r.height + pad * 2
        };
    }

    /**
     * Place popover beside the highlight so it does not cover the target (sidebar steps → open on the right).
     */
    function rectOverlapArea(ax, ay, aw, ah, bx, by, bw, bh) {
        var ix = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx));
        var iy = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by));
        return ix * iy;
    }

    function pickPopoverPosition(rect, pw, ph) {
        var margin = 12;
        var pad = 16;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var targetMidX = rect.left + rect.width / 2;
        var preferRight = targetMidX < vw * 0.42;

        function clamp(l, t) {
            return {
                left: Math.max(pad, Math.min(l, vw - pw - pad)),
                top: Math.max(pad, Math.min(t, vh - ph - pad))
            };
        }

        var vy = rect.top + (rect.height - ph) / 2;
        var hx = (rect.width - pw) / 2;
        var candidates = preferRight
            ? [
                  { l: rect.left + rect.width + margin, t: vy },
                  { l: rect.left + hx, t: rect.top + rect.height + margin },
                  { l: rect.left + hx, t: rect.top - ph - margin },
                  { l: rect.left - pw - margin, t: vy }
              ]
            : [
                  { l: rect.left - pw - margin, t: vy },
                  { l: rect.left + hx, t: rect.top + rect.height + margin },
                  { l: rect.left + hx, t: rect.top - ph - margin },
                  { l: rect.left + rect.width + margin, t: vy }
              ];

        var best = null;
        var bestOverlap = Infinity;
        for (var i = 0; i < candidates.length; i++) {
            var c = clamp(candidates[i].l, candidates[i].t);
            var o = rectOverlapArea(c.left, c.top, pw, ph, rect.left, rect.top, rect.width, rect.height);
            if (o === 0) {
                return c;
            }
            if (o < bestOverlap) {
                bestOverlap = o;
                best = c;
            }
        }
        return best || clamp(candidates[0].l, candidates[0].t);
    }

    function layoutTour() {
        if (!tourRoot) return;
        const spotlight = tourRoot.querySelector('.tour-spotlight');
        const popover = tourRoot.querySelector('.tour-popover');
        const rect = getTargetRect();

        if (!rect) {
            spotlight.classList.add('tour-spotlight--hidden');
            popover.classList.add('tour-popover--center');
            popover.style.top = '50%';
            popover.style.left = '50%';
            popover.style.right = 'auto';
            popover.style.bottom = 'auto';
            popover.style.transform = 'translate(-50%, -50%)';
            return;
        }

        var html = document.documentElement;
        if (html.classList.contains('tour-projection-step') ||
            html.classList.contains('tour-style-modal-step')) {
            spotlight.classList.add('tour-spotlight--hidden');
        } else {
            spotlight.classList.remove('tour-spotlight--hidden');
        }
        popover.classList.remove('tour-popover--center');
        spotlight.style.top = rect.top + 'px';
        spotlight.style.left = rect.left + 'px';
        spotlight.style.width = rect.width + 'px';
        spotlight.style.height = rect.height + 'px';

        const pw = Math.min(360, window.innerWidth - 32);
        popover.style.width = pw + 'px';
        popover.style.transform = 'none';
        popover.style.visibility = 'hidden';
        popover.style.left = '0px';
        popover.style.top = '0px';
        const ph = popover.offsetHeight || 200;
        popover.style.visibility = '';

        const pos = pickPopoverPosition(rect, pw, ph);
        popover.style.top = pos.top + 'px';
        popover.style.left = pos.left + 'px';
        popover.style.right = 'auto';
        popover.style.bottom = 'auto';
    }

    function onResize() {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(function () {
            resizeRaf = 0;
            layoutTour();
        });
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            endTour(true);
        }
    }

    function restartTourFromBeginning() {
        if (!tourRoot) return;
        tourIndex = 0;
        tourEnsureSidebarClosedMobile();
        if (typeof closeProjectionModal === 'function') closeProjectionModal();
        if (typeof closeWKTModal === 'function') closeWKTModal();
        if (typeof closeStyleModal === 'function') closeStyleModal();
        document.documentElement.classList.remove(
            'tour-projection-step',
            'tour-wkt-modal-step',
            'tour-style-modal-step'
        );
        if (tourRoot) {
            tourRoot.style.zIndex = '';
            var overlay = tourRoot.querySelector('.tour-overlay');
            var spotlight = tourRoot.querySelector('.tour-spotlight');
            var popover = tourRoot.querySelector('.tour-popover');
            if (overlay) overlay.style.display = '';
            if (spotlight) spotlight.style.display = '';
            if (popover) popover.style.zIndex = '';
        }
        var before0 = STEP_BEFORE[0];
        if (typeof before0 === 'function') before0();
        requestAnimationFrame(function () {
            updatePopoverTexts();
            layoutTour();
            requestAnimationFrame(layoutTour);
        });
    }

    function goStep(delta) {
        const next = tourIndex + delta;
        if (next < 0 || next >= getStepCount()) return;
        tourIndex = next;
        const before = STEP_BEFORE[tourIndex];
        if (typeof before === 'function') before();
        const def = STEP_DEFS[tourIndex];
        if (def && def.selector) {
            const el = document.querySelector(def.selector);
            if (el) {
                try {
                    el.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'nearest' });
                } catch (e) { /* ignore */ }
            }
        }
        requestAnimationFrame(function () {
            updatePopoverTexts();
            layoutTour();
            requestAnimationFrame(layoutTour);
        });
    }

    function endTour(saveDismissPreference) {
        const cb = document.getElementById('tourDontShowAgain');
        if (saveDismissPreference && cb && cb.checked) {
            dismissTourForever();
        }
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onKeyDown);
        document.documentElement.classList.remove(
            'tour-projection-step',
            'tour-wkt-modal-step',
            'tour-style-modal-step'
        );
        if (typeof closeProjectionModal === 'function') {
            closeProjectionModal();
        }
        if (typeof closeWKTModal === 'function') {
            closeWKTModal();
        }
        if (typeof closeStyleModal === 'function') {
            closeStyleModal();
        }
        if (tourRoot) {
            tourRoot.remove();
            tourRoot = null;
        }
        document.documentElement.classList.remove('tour-active');
    }

    function bindPopoverActions() {
        document.getElementById('tourCloseBtn').addEventListener('click', function () {
            endTour(true);
        });
        document.getElementById('tourRestartBtn').addEventListener('click', function () {
            restartTourFromBeginning();
        });
        document.getElementById('tourPrevBtn').addEventListener('click', function () {
            goStep(-1);
        });
        document.getElementById('tourNextBtn').addEventListener('click', function () {
            if (tourIndex >= getStepCount() - 1) {
                endTour(true);
            } else {
                goStep(1);
            }
        });
    }

    /**
     * @param {boolean} fromHelpButton - true: always run; false: only if not permanently dismissed
     */
    window.startGuidedTour = function (fromHelpButton) {
        if (tourRoot) return;

        if (!fromHelpButton && !shouldAutoStartTour()) return;

        if (typeof t !== 'function') {
            console.error('WKT Tour: i18n t() is not available.');
            return;
        }

        tourIndex = 0;

        tourRoot = document.createElement('div');
        tourRoot.id = 'tourRoot';
        tourRoot.className = 'tour-root';
        tourRoot.innerHTML =
            '<div class="tour-overlay" aria-hidden="true"></div>' +
            '<div class="tour-spotlight" aria-hidden="true"></div>' +
            buildPopoverHtml();

        document.body.appendChild(tourRoot);
        document.documentElement.classList.add('tour-active');

        bindPopoverActions();
        updatePopoverTexts();

        const before0 = STEP_BEFORE[0];
        if (typeof before0 === 'function') before0();

        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', onKeyDown);

        requestAnimationFrame(function () {
            layoutTour();
            requestAnimationFrame(layoutTour);
        });
    };

    /**
     * After map init: optional ?tour=1 clears "don't show again" and forces the tour once.
     */
    function bootAutoTour() {
        var params = (function () {
            try {
                return new URLSearchParams(window.location.search);
            } catch (e) {
                return { get: function () { return null; } };
            }
        })();
        var force = params.get('tour');
        if (force === '1' || force === 'true' || force === 'yes') {
            try {
                localStorage.removeItem(STORAGE_SKIP);
            } catch (e) { /* ignore */ }
        }

        var attempts = 0;
        function tryStart() {
            attempts++;
            if (!window.wktMapViewerMap) {
                if (attempts < 100) {
                    setTimeout(tryStart, 50);
                }
                return;
            }
            setTimeout(function () {
                if (typeof window.startGuidedTour === 'function') {
                    window.startGuidedTour(false);
                }
            }, 500);
        }
        setTimeout(tryStart, 0);
    }

    window.addEventListener('load', bootAutoTour);

    window.onWktViewerLanguageChanged = function () {
        if (!tourRoot) return;
        updatePopoverTexts();
        layoutTour();
    };
})();
