# Component Guide

Quick reference for components and design tokens. Use exact names — do not rename or create synonyms.

## Token Quick Reference

```json
{
  "color": {
    "focus": "#2563EB",
    "action": {
      "primary": "#111111",
      "secondary": "#FFFFFF",
      "ghost_text": "#414141",
      "disabled_bg": "#E7E5E0",
      "ghost_hover": "#F5F4F1",
      "primary_text": "#FFFFFF",
      "disabled_text": "#8A8782",
      "primary_hover": "#2A2A2A",
      "primary_active": "#000000",
      "secondary_text": "#111111",
      "secondary_hover": "#F5F4F1",
      "secondary_border": "#D8D5CF"
    },
    "neutral": {
      "ink": "#111111",
      "line": "#D8D5CF",
      "mist": "#F5F4F1",
      "muted": "#8A8782",
      "paper": "#FFFFFF",
      "slate": "#6B6B6B",
      "stone": "#E7E5E0",
      "graphite": "#414141",
      "ink_soft": "#1C1C1C"
    },
    "overlay": "rgba(17, 17, 17, 0.48)",
    "semantic": {
      "info": {
        "icon": "#1D4ED8",
        "text": "#1D4ED8",
        "border": "#B8CDFB",
        "surface": "#EAF1FF"
      },
      "error": {
        "icon": "#B3261E",
        "text": "#B3261E",
        "border": "#F2B8B5",
        "surface": "#FBEAE9"
      },
      "success": {
        "icon": "#1E6B3A",
        "text": "#1E6B3A",
        "border": "#A7D7B8",
        "surface": "#E7F4EC"
      },
      "warning": {
        "icon": "#7A5200",
        "text": "#7A5200",
        "border": "#F0D48A",
        "surface": "#FFF4D6"
      }
    }
  },
  "radii": {
    "pill": "999px",
    "large": "16px",
    "small": "8px",
    "medium": "12px"
  },
  "motion": {
    "easing": "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
    "duration_base": "200ms",
    "duration_fast": "120ms",
    "duration_slow": "300ms",
    "reduced_motion": "Respetar prefers-reduced-motion: desactivar animaciones no esenciales y mantener \u00fanicamente cambios de opacidad o estado."
  },
  "shadows": {
    "card": "0px 4px 12px rgba(17, 17, 17, 0.07)",
    "modal": "0px 16px 40px rgba(17, 17, 17, 0.16)",
    "subtle": "0px 1px 2px rgba(17, 17, 17, 0.06)",
    "floating": "0px 8px 24px rgba(17, 17, 17, 0.10)",
    "focus_ring": "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #2563EB"
  },
  "spacing": {
    "unit": "4px",
    "scale": [
      0,
      4,
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      56,
      64,
      80,
      96,
      128
    ],
    "page_gutter": {
      "mobile": "20px",
      "desktop": "48px"
    },
    "section_gap": {
      "mobile": "32px",
      "desktop": "64px"
    },
    "card_padding": {
      "mobile": "16px",
      "desktop": "24px"
    }
  },
  "typography": {
    "scale": {
      "body_lg": {
        "size": "16px",
        "weight": "400",
        "line_height": "26px",
        "letter_spacing": "0em"
      },
      "body_md": {
        "size": "14px",
        "weight": "400",
        "line_height": "22px",
        "letter_spacing": "0em"
      },
      "body_sm": {
        "size": "13px",
        "weight": "400",
        "line_height": "20px",
        "letter_spacing": "0em"
      },
      "label_md": {
        "size": "14px",
        "weight": "500",
        "line_height": "20px",
        "letter_spacing": "0em"
      },
      "label_sm": {
        "size": "12px",
        "weight": "500",
        "line_height": "18px",
        "letter_spacing": "0.02em"
      },
      "title_lg": {
        "size": "28px",
        "weight": "600",
        "line_height": "36px",
        "letter_spacing": "-0.01em"
      },
      "title_md": {
        "size": "22px",
        "weight": "600",
        "line_height": "30px",
        "letter_spacing": "-0.01em"
      },
      "title_sm": {
        "size": "18px",
        "weight": "600",
        "line_height": "26px",
        "letter_spacing": "0em"
      },
      "display_lg": {
        "size": "44px",
        "weight": "600",
        "line_height": "52px",
        "letter_spacing": "-0.02em"
      },
      "display_md": {
        "size": "36px",
        "weight": "600",
        "line_height": "44px",
        "letter_spacing": "-0.02em"
      }
    },
    "family": {
      "numeric": "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace",
      "primary": "Inter",
      "fallback": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }
  },
  "breakpoints": {
    "wide": "1440px",
    "mobile": "360px",
    "tablet": "768px",
    "desktop": "1200px"
  },
  "accessibility": {
    "touch_target": "M\u00ednimo 44x44px para controles t\u00e1ctiles.",
    "focus_visible": "Anillo de 2px en azul #2563EB con contraste suficiente sobre cualquier superficie.",
    "contrast_target": "WCAG 2.2 AA",
    "states_without_color": "Los estados de puntos, reserva, error y vencimiento siempre combinan texto, icono y color."
  },
  "icon_image_style": {
    "icon_set": "Iconos de l\u00ednea, trazo 1.5px, esquinas suaves, tama\u00f1o base 20px y 24px. Los \u00edconos acompa\u00f1an etiquetas de texto para estados y acciones.",
    "logo_usage": "El logotipo oficial queda pendiente. En los prototipos se reserva un contenedor de marca de alto contraste, sin sustitui
```

## Available Components

- **NavegaciónPrincipal**: 
- **BotónPrimario**: 
- **Tarjeta**: 
- **ResumenPuntos**: 
- **EtiquetaEstado**: 
- **CampoTexto**: 
- **Selector**: 
- **TablaDatos**: 
- **BarraFiltros**: 
- **Modal**: 
- **Alerta**: 
- **EstadoVacio**: 
- **FilaMovimiento**: 
- **PasosProceso**: 
- **Pestanas**: 
- **PanelResumenAdmin**: 
- **SubidaEvidencia**: 
