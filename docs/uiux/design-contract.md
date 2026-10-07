# UI/UX Design Contract

> **READ THIS FILE BEFORE IMPLEMENTING ANY FRONTEND COMPONENT.**
> This is the single source of truth for all visual and functional requirements.

## Figma Source

File URL: https://www.figma.com/design/BeZqQxsdhMEo5uoXYovD7w

## Visual Direction

Dirección visual neutra, premium y minimalista. Superficies claras y silenciosas, tipografía precisa y numerosos espacios en blanco para que los puntos, importes y estados sean los protagonistas. El sistema usa una base cálida neutra con acentos semánticos de bajo saturación, bordes finos, sombras suaves y componentes rectos con esquinas moderadamente redondeadas. La jerarquía se logra por escala tipográfica, peso y contraste AA, no por color. Mientras se recibe el manual oficial de Camper, esta dirección mantiene una identidad contenida y fácilmente reemplazable por los tokens aprobados sin romper la estructura.

## Pages / Figma Frames

### 1. Portal del cliente
- **node_id**: 5:297
- **purpose**: Frame inicial del portal autenticado con saldo destacado y accesos principales.
- **sections**: ['Encabezado de cliente autenticado', 'Navegación principal', 'Tarjeta de saldo destacada', 'Accesos rápidos', 'Aviso de próxima liberación o vencimiento']
- **screenshot_object_name**: 01fdd020-5b48-42d0-844e-f283308896f4/UIUX/1791322986951-Portal_del_cliente-default.png

### 2. Inscripción
- **node_id**: 5:157
- **purpose**: Frame de inscripción y aceptación de términos.
- **sections**: ['Identificación y vinculación de cuenta', 'Resumen del beneficio', 'Términos y condiciones versionados', 'Consentimiento comercial opcional', 'Confirmación de inscripción']
- **screenshot_object_name**: 01fdd020-5b48-42d0-844e-f283308896f4/UIUX/1791322987454-Inscripci_n-default.png

### 3. Resumen de puntos
- **node_id**: 5:367
- **purpose**: Frame con fotografía general de puntos y equivalente COP.
- **sections**: ['Total de puntos disponibles', 'Equivalencia en COP', 'Puntos pendientes acumulados', 'Mini historial reciente', 'Llamado a la acción de canje']
- **screenshot_object_name**: 01fdd020-5b48-42d0-844e-f283308896f4/UIUX/1791322987971-Resumen_de_puntos-default.png

### 4. Saldo disponible y pendiente
- **purpose**: Frame de detalle de saldos y lotes con fechas de liberación.
- **sections**: ['Tarjetas de saldo disponible y pendiente', 'Explicación de la regla de liberación', 'Detalle de lotes de puntos', 'Estimación de fecha de liberación', 'Notas sobre reversiones o bloqueos']

### 5. Historial
- **purpose**: Frame con movimientos del cliente filtrables.
- **sections**: ['Filtros por tipo, fecha y pedido', 'Lista de movimientos', 'Detalle de movimiento', 'Exportación de historial', 'Estados vacíos y de error']

### 6. Próximos vencimientos
- **node_id**: 9:6
- **purpose**: Frame de lotes por vencer y aviso.
- **sections**: ['Lista de lotes por vencer', 'Cantidad de puntos y fecha de vencimiento', 'Indicador de urgencia', 'Preferencia de notificación', 'Llamado a usar puntos']
- **screenshot_object_name**: 01fdd020-5b48-42d0-844e-f283308896f4/UIUX/1791322989435-Pr_ximos_vencimientos-default.png

### 7. Términos
- **node_id**: 10:2
- **purpose**: Frame de términos vigentes y registro de aceptación.
- **sections**: ['Versión vigente del programa', 'Contenido de términos', 'Condiciones de acumulación y canje', 'Registro de aceptación', 'Contacto de soporte']
- **screenshot_object_name**: 01fdd020-5b48-42d0-844e-f283308896f4/UIUX/1791322989936-T_rminos-default.png

### 8. Aplicación de puntos en el pago
- **node_id**: 11:7
- **purpose**: Frame de simulación y reserva de puntos en checkout.
- **sections**: ['Resumen del pedido', 'Simulación de puntos a usar', 'Validación de mínimo y máximo', 'Reserva de puntos', 'Confirmación del descuento']
- **screenshot_object_name**: 01fdd020-5b48-42d0-844e-f283308896f4/UIUX/1791322990459-Aplicaci_n_de_puntos_en_el_pago-default.png

## Design Tokens

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
    "logo_usage": "El logotipo oficial queda pendiente. En los prototipos se reserva un contenedor de marca de alto contraste, sin sustituir ni redibujar el logo oficial.",
    "image_style": "Fotograf\u00eda de producto en recorte c\u00e1lido y neutro; proporci\u00f3n 4:5 en tarjetas. Mientras no exista banco autorizado, se usan placeholders neutros y sin marca. Sin ilustraciones decorativas."
  },
  "provisional_notice": "Identidad visual oficial de Camper pendiente de entrega. Los tokens siguientes son una base provisional neutra y accesible, dise\u00f1ada para ser sustituida por la paleta, tipograf\u00edas, logotipos y componentes aprobados por Marca/Marketing sin alterar la arquitectura de pantallas."
}
```

## Base Components

### `NavegaciónPrincipal`

Props:
```json
[
  "items: NavItem[]",
  "activeId: string",
  "user?: CurrentUser",
  "onNavigate: (id: string) => void"
]
```

### `BotónPrimario`

Props:
```json
[
  "label: string",
  "variant?: 'primary' | 'secondary' | 'ghost'",
  "size?: 'sm' | 'md' | 'lg'",
  "icon?: ReactNode",
  "disabled?: boolean",
  "loading?: boolean",
  "onClick: () => void"
]
```

### `Tarjeta`

Props:
```json
[
  "title?: string",
  "sectionTitle?: string",
  "padding?: 'sm' | 'md' | 'lg'",
  "elevation?: 'subtle' | 'card'",
  "children: ReactNode"
]
```

### `ResumenPuntos`

Props:
```json
[
  "availablePoints: number",
  "pendingPoints: number",
  "currency: 'COP'",
  "exchangeRate: number",
  "expiresSoonCount?: number"
]
```

### `EtiquetaEstado`

Props:
```json
[
  "status: 'success' | 'warning' | 'error' | 'info' | 'neutral'",
  "label: string",
  "icon?: ReactNode"
]
```

### `CampoTexto`

Props:
```json
[
  "label: string",
  "value: string",
  "placeholder?: string",
  "type?: 'text' | 'email' | 'number' | 'date' | 'search'",
  "error?: string",
  "required?: boolean",
  "disabled?: boolean",
  "onChange: (value: string) => void"
]
```

### `Selector`

Props:
```json
[
  "label: string",
  "value: string",
  "options: SelectOption[]",
  "placeholder?: string",
  "error?: string",
  "disabled?: boolean",
  "onChange: (value: string) => void"
]
```

### `TablaDatos`

Props:
```json
[
  "columns: Column[]",
  "rows: Row[]",
  "loading?: boolean",
  "emptyState?: ReactNode",
  "errorState?: ReactNode",
  "onRowClick?: (row: Row) => void"
]
```

### `BarraFiltros`

Props:
```json
[
  "filters: FilterDefinition[]",
  "values: Record<string, string>",
  "onChange: (values: Record<string, string>) => void"
]
```

### `Modal`

Props:
```json
[
  "title: string",
  "open: boolean",
  "onClose: () => void",
  "footer?: ReactNode",
  "size?: 'sm' | 'md' | 'lg'",
  "children: ReactNode"
]
```

### `Alerta`

Props:
```json
[
  "tone: 'success' | 'warning' | 'error' | 'info'",
  "title: string",
  "message?: string",
  "actionLabel?: string",
  "onAction?: () => void"
]
```

### `EstadoVacio`

Props:
```json
[
  "title: string",
  "description?: string",
  "actionLabel?: string",
  "onAction?: () => void"
]
```

### `FilaMovimiento`

Props:
```json
[
  "type: 'acumulacion' | 'canje' | 'reversion' | 'ajuste' | 'vencimiento'",
  "points: number",
  "timestamp: string",
  "reference?: string",
  "status?: string"
]
```

### `PasosProceso`

Props:
```json
[
  "steps: Step[]",
  "currentIndex: number",
  "onStepClick?: (index: number) => void"
]
```

### `Pestanas`

Props:
```json
[
  "tabs: Tab[]",
  "activeId: string",
  "onChange: (id: string) => void"
]
```

### `PanelResumenAdmin`

Props:
```json
[
  "label: string",
  "value: string",
  "trend?: 'up' | 'down' | 'flat'",
  "helperText?: string",
  "icon?: ReactNode"
]
```

### `SubidaEvidencia`

Props:
```json
[
  "files: EvidenceFile[]",
  "maxFiles?: number",
  "acceptedTypes?: string[]",
  "onUpload: (files: File[]) => void",
  "onRemove: (id: string) => void"
]
```


## Preliminary Spec

```json
{
  "status": "complete",
  "audience": "Cliente, Marketing/responsable del programa, Atenci\u00f3n al cliente, Operaci\u00f3n, Aprobador de ajustes",
  "site_goal": "Implementar un programa de puntos por compra de calzado que incentive la recompra, permita a los clientes consultar y utilizar sus beneficios, y entregue a Camper control sobre costos, trazabilidad y medici\u00f3n de la participaci\u00f3n del programa.",
  "brand_tone": "Neutro, premium y minimalista",
  "last_asked": null,
  "constraints": [
    "Piloto inicial en Colombia, moneda COP y canal de venta \u00fanico",
    "\u00danica regla de acumulaci\u00f3n por l\u00ednea; las devoluciones revierten los puntos seg\u00fan la regla original",
    "Los cambios de reglas usan versiones y fechas de vigencia, sin recalcular compras anteriores",
    "Aplicar la identidad visual oficial de Camper; el manual vigente y sus activos est\u00e1n pendientes",
    "Objetivo de accesibilidad WCAG 2.2 AA para el frontend"
  ],
  "assumed_items": [],
  "item_attempts": {
    "tono": 1,
    "audiencia": 1,
    "pantallas": 1
  },
  "open_questions": [],
  "confirmed_items": [
    "audiencia",
    "pantallas",
    "tono"
  ],
  "gaps_to_resolve": [],
  "readiness_reason": "Se confirmaron el objetivo, la audiencia, el tono visual y el listado de pantallas; el usuario indic\u00f3 continuar.",
  "ready_for_phase_2": true,
  "sections_or_pages": [
    "Portal del cliente",
    "Inscripci\u00f3n",
    "Resumen de puntos",
    "Saldo disponible y pendiente",
    "Historial",
    "Pr\u00f3ximos vencimientos",
    "T\u00e9rminos",
    "Aplicaci\u00f3n de puntos en el pago",
    "Canje",
    "Consola administrativa",
    "Reglas configurables",
    "Ajustes autorizados",
    "Devoluciones",
    "Conciliaci\u00f3n",
    "Auditor\u00eda",
    "Reportes"
  ],
  "style_preferences": "Neutro, premium y minimalista",
  "visual_references": [],
  "last_asked_options": null,
  "design_requirements": {
    "visual_style": "Tono neutro, premium y minimalista, coherente con la identidad de Camper y sin asumir colores oficiales hasta validarlos.",
    "content_needs": "Interfaz en espa\u00f1ol, con estados de carga, errores recuperables y confirmaci\u00f3n del canje.",
    "brand_identity": "Identidad visual oficial de Camper; manual vigente y activos de marca pendientes de recibir. La paleta editorial del requerimiento no constituye certificaci\u00f3n de los colores corporativos.",
    "interaction_needs": "Aplicaci\u00f3n de puntos en el pago con reserva y confirmaci\u00f3n, filtros por cliente, pedido y fecha, ajustes con evidencia y permisos separados por rol.",
    "responsive_accessibility": "Interfaz adaptable a celular y escritorio; objetivo WCAG 2.2 AA con contraste, foco visible y navegaci\u00f3n por teclado; los estados de puntos y errores deben comunicarse con texto o iconos adem\u00e1s de color.",
    "technical_or_figma_context": "Camper debe entregar manual de marca vigente, paleta y tipograf\u00edas oficiales, logotipos, banco de im\u00e1genes autorizado, gu\u00eda digital o biblioteca de componentes si existe, y responsable de aprobaci\u00f3n."
  },
  "confirmed_assumptions": [
    "El portal del cliente y la consola administrativa son los entregables de experiencia a dise\u00f1ar para el piloto en Colombia.",
    "La audiencia queda confirmada con los roles definidos en el requerimiento.",
    "El tono visual queda confirmado como neutro, premium y minimalista."
  ]
}
```

## Figma Design Context (layout, spacing, component tree)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_design_context",
    "auth_required": false,
    "message": "Figma requires a nodeId; the provided URL contains only a file key.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [
    {
      "tool": "get_design_context",
      "status": "in_progress",
      "error": null,
      "text": ""
    },
    {
      "tool": "get_design_context",
      "status": "failed",
      "error": null,
      "text": "Input validation error: Invalid arguments for tool get_design_context: nodeId: Invalid input: expected string, received undefined\n"
    }
  ],
  "error": "Figma did not confirm completion of the requested operation.",
  "error_code": "figma_tool_unverified",
  "tool_evidence_required": [
    "get_design_context"
  ]
}
```

## Figma Variable Definitions (token names + values)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_variable_defs",
    "auth_required": false,
    "message": "A concrete node_id is required to retrieve variable definitions.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [
    {
      "tool": "get_variable_defs",
      "status": "in_progress",
      "error": null,
      "text": ""
    },
    {
      "tool": "get_variable_defs",
      "status": "failed",
      "error": null,
      "text": "Input validation error: Invalid arguments for tool get_variable_defs: nodeId: Invalid input: expected string, received undefined\n"
    }
  ],
  "error": "Figma did not confirm completion of the requested operation.",
  "error_code": "figma_tool_unverified",
  "tool_evidence_required": [
    "get_variable_defs"
  ]
}
```

## Code Connect Map (Figma component → code file)

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "get_code_connect_map",
    "auth_required": false,
    "message": "A node-specific Figma URL or node ID is required; the provided file URL does not include one.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [],
  "error": "A node-specific Figma URL or node ID is required; the provided file URL does not include one."
}
```

## Design System Rules

```json
{
  "success": false,
  "result": {
    "success": false,
    "action": "create_design_system_rules",
    "auth_required": false,
    "message": "The required Figma MCP tool create_design_system_rules is unavailable.",
    "figma": {}
  },
  "auth_required": false,
  "provider": "codex",
  "return_code": 0,
  "model": "gpt-5.6-luna",
  "figma_tool_events": [],
  "error": "The required Figma MCP tool create_design_system_rules is unavailable."
}
```

## Screenshots (workspace-relative paths)

- **Portal del cliente**: `design/screenshots/Portal_del_cliente.png`
- **Inscripci n**: `design/screenshots/Inscripci_n.png`
- **Resumen de puntos**: `design/screenshots/Resumen_de_puntos.png`
- **Pr ximos vencimientos**: `design/screenshots/Pr_ximos_vencimientos.png`
- **T rminos**: `design/screenshots/T_rminos.png`
- **Aplicaci n de puntos en el pago**: `design/screenshots/Aplicaci_n_de_puntos_en_el_pago.png`
