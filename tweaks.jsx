const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8ECFF1",
  "intensity": 1,
  "speed": 1,
  "grain": true,
  "cursorGlow": true,
  "whiteAfterPhoto": true
}/*EDITMODE-END*/;

function SolarioTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.classList.toggle('no-cursor-glow', !t.cursorGlow);
    document.body.classList.toggle('white-after-photo', t.whiteAfterPhoto);
    if (window.SOLARIO) {
      window.SOLARIO.setParams({
        intensity: t.intensity,
        speed: t.speed,
        grain: t.grain ? 1 : 0
      });
    }
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Wallpaper" />
      <TweakSlider label="Intensidad" value={t.intensity} min={0.4} max={2} step={0.05}
                   onChange={(v) => setTweak('intensity', v)} />
      <TweakSlider label="Velocidad" value={t.speed} min={0.3} max={2} step={0.05}
                   onChange={(v) => setTweak('speed', v)} />
      <TweakToggle label="Grano de película" value={t.grain}
                   onChange={(v) => setTweak('grain', v)} />
      <TweakSection label="Sitio" />
      <TweakToggle label="Fondo blanco tras la foto" value={t.whiteAfterPhoto}
                   onChange={(v) => setTweak('whiteAfterPhoto', v)} />
      <TweakColor label="Acento" value={t.accent}
                  options={['#8ECFF1', '#5BB8E8', '#15499D', '#2F5BB0']}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakToggle label="Luz sigue al cursor" value={t.cursorGlow}
                   onChange={(v) => setTweak('cursorGlow', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<SolarioTweaks></SolarioTweaks>);
