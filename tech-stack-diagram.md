# PolicyEngine Tech Stack Architecture

## Current State Architecture

```mermaid
graph TB
    %% Style definitions
    classDef core fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef country fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef data fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef app fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef utility fill:#f5f5f5,stroke:#424242,stroke-width:2px
    classDef deprecated fill:#ffcccc,stroke:#cc0000,stroke-width:2px,stroke-dasharray: 5 5

    %% Utility Layer
    microdf["<a href='https://github.com/PolicyEngine/microdf'>microdf</a><br/>Distributional analysis tools"]:::utility
    microimpute["<a href='https://github.com/PolicyEngine/microimpute'>microimpute</a><br/>Imputation methods"]:::utility
    
    %% Core Layer
    core["<a href='https://github.com/PolicyEngine/policyengine-core'>policyengine-core</a><br/>Core simulation engine<br/>(OpenFisca fork)"]:::core
    
    %% Country Models Layer
    us["<a href='https://github.com/PolicyEngine/policyengine-us'>policyengine-us</a><br/>US tax-benefit model"]:::country
    uk["<a href='https://github.com/PolicyEngine/policyengine-uk'>policyengine-uk</a><br/>UK tax-benefit model"]:::country
    canada["<a href='https://github.com/PolicyEngine/policyengine-canada'>policyengine-canada</a><br/>Canadian model"]:::country
    
    %% Data Layer
    usdata["<a href='https://github.com/PolicyEngine/policyengine-us-data'>policyengine-us-data</a><br/>Enhanced CPS microdata"]:::data
    ukdata["<a href='https://github.com/PolicyEngine/policyengine-uk-data'>policyengine-uk-data</a><br/>UK microdata"]:::data
    
    %% Integration Layer
    pypackage["<a href='https://github.com/PolicyEngine/policyengine.py'>policyengine.py</a><br/>Python package<br/>(integrates all models)"]:::core
    
    %% API Layer
    api["<a href='https://github.com/PolicyEngine/policyengine-api'>policyengine-api</a><br/>REST API (Flask)<br/>(being deprecated)"]:::deprecated
    apiv2["<a href='https://github.com/PolicyEngine/policyengine-api-v2'>policyengine-api-v2</a><br/>Next-gen API"]:::api
    household["<a href='https://github.com/PolicyEngine/policyengine-household-api'>policyengine-household-api</a><br/>Household calculations API"]:::api
    
    %% Application Layer
    app["<a href='https://github.com/PolicyEngine/policyengine-app'>policyengine-app</a><br/>React web app<br/>(main interface)"]:::app
    
    %% Dependencies
    microdf --> core
    core --> us
    core --> uk
    core --> canada
    
    us --> usdata
    uk --> ukdata
    microimpute --> usdata
    
    us --> api
    uk --> api
    canada --> api
    
    us --> household
    uk --> household
    canada --> household
    
    us --> pypackage
    uk --> pypackage
    canada --> pypackage
    
    usdata -.-> apiv2
    ukdata -.-> apiv2
    pypackage --> apiv2
    
    api --> app
    apiv2 --> app
    household --> app
    
    %% Add note about datasets
    usdata -.->|produces<br/>datasets| apiv2
    ukdata -.->|produces<br/>datasets| apiv2
```

## Future State Architecture

```mermaid
graph TB
    %% Style definitions
    classDef core fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef country fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef data fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef app fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef utility fill:#f5f5f5,stroke:#424242,stroke-width:2px
    classDef new fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    classDef removed fill:#ffebee,stroke:#c62828,stroke-width:2px,stroke-dasharray: 5 5,opacity:0.5

    %% Utility Layer
    microdf["<a href='https://github.com/PolicyEngine/microdf'>microdf</a><br/>Distributional analysis tools"]:::utility
    microimpute["<a href='https://github.com/PolicyEngine/microimpute'>microimpute</a><br/>Imputation methods"]:::utility
    l0["<a href='https://github.com/PolicyEngine/L0'>L0</a><br/>L0 penalty optimization"]:::utility
    microcalibrate["<a href='#'>microcalibrate</a><br/>Calibration tools<br/>(new)"]:::new
    
    %% Core Layer
    core["<a href='https://github.com/PolicyEngine/policyengine-core'>policyengine-core</a><br/>Core simulation engine<br/>(OpenFisca fork)"]:::core
    
    %% Country Models Layer
    us["<a href='https://github.com/PolicyEngine/policyengine-us'>policyengine-us</a><br/>US tax-benefit model"]:::country
    uk["<a href='https://github.com/PolicyEngine/policyengine-uk'>policyengine-uk</a><br/>UK tax-benefit model"]:::country
    canada["<a href='https://github.com/PolicyEngine/policyengine-canada'>policyengine-canada</a><br/>Canadian model"]:::country
    israel["<a href='#'>policyengine-il</a><br/>Israel model<br/>(planned)"]:::new
    nigeria["<a href='#'>policyengine-ng</a><br/>Nigeria model<br/>(planned)"]:::new
    
    %% Unified Data Layer
    unifieddata["<a href='#'>policyengine-data</a><br/>Unified data package<br/>(new)"]:::new
    usdata["<a href='https://github.com/PolicyEngine/policyengine-us-data'>policyengine-us-data</a><br/>Enhanced CPS microdata"]:::data
    ukdata["<a href='https://github.com/PolicyEngine/policyengine-uk-data'>policyengine-uk-data</a><br/>UK microdata"]:::data
    
    %% Integration Layer
    pypackage["<a href='https://github.com/PolicyEngine/policyengine.py'>policyengine.py</a><br/>Python package<br/>(expanded role)"]:::core
    
    %% API Layer (simplified)
    apiv2["<a href='https://github.com/PolicyEngine/policyengine-api-v2'>policyengine-api-v2</a><br/>Primary API"]:::api
    household["<a href='https://github.com/PolicyEngine/policyengine-household-api'>policyengine-household-api</a><br/>Household calculations API"]:::api
    
    %% Application Layer
    app["<a href='https://github.com/PolicyEngine/policyengine-app'>policyengine-app</a><br/>React web app<br/>(main interface)"]:::app
    appv2["<a href='https://github.com/PolicyEngine/policyengine-app-v2'>policyengine-app-v2</a><br/>Next-gen web app<br/>(TypeScript)"]:::new
    
    %% Dependencies
    microdf --> core
    core --> us
    core --> uk
    core --> canada
    core --> israel
    core --> nigeria
    
    %% New data flow
    l0 --> microcalibrate
    microimpute --> unifieddata
    microcalibrate --> unifieddata
    unifieddata --> usdata
    unifieddata --> ukdata
    
    us --> usdata
    uk --> ukdata
    
    %% Expanded policyengine.py role
    us --> pypackage
    uk --> pypackage
    canada --> pypackage
    israel --> pypackage
    nigeria --> pypackage
    
    pypackage --> apiv2
    pypackage --> household
    
    usdata -.->|produces<br/>datasets| apiv2
    ukdata -.->|produces<br/>datasets| apiv2
    
    apiv2 --> app
    apiv2 --> appv2
    household --> app
    household --> appv2
    
    %% Removed API (shown faded)
    apiold["policyengine-api<br/>(removed)"]:::removed
```

## Key Architecture Changes

### Current → Future State Transitions

#### 🔴 **Deprecations**
- **policyengine-api**: Legacy Flask API being phased out
- Direct country model → API connections being replaced by policyengine.py integration

#### 🟢 **New Components**
- **policyengine-data**: Unified data package consolidating country-specific data generation
- **microcalibrate**: Dedicated calibration tools (fed by L0 optimization)
- **policyengine-il**: Israel tax-benefit model
- **policyengine-ng**: Nigeria tax-benefit model
- **policyengine-app-v2**: TypeScript-based next-generation web application

#### 🔄 **Enhanced Roles**
- **policyengine.py**: Becomes the primary integration point, feeding household-api in addition to api-v2
- **policyengine-data**: Centralizes data generation logic currently spread across country-specific repos

## Repository Directory

### Core Infrastructure
- [policyengine-core](https://github.com/PolicyEngine/policyengine-core) - Core simulation engine
- [policyengine.py](https://github.com/PolicyEngine/policyengine.py) - Python package integrating all models

### Country Models
- [policyengine-us](https://github.com/PolicyEngine/policyengine-us) - US federal and state model
- [policyengine-uk](https://github.com/PolicyEngine/policyengine-uk) - UK tax-benefit model
- [policyengine-canada](https://github.com/PolicyEngine/policyengine-canada) - Canadian model (early stage)

### Data & Analytics
- [policyengine-us-data](https://github.com/PolicyEngine/policyengine-us-data) - US microdata generation
- [policyengine-uk-data](https://github.com/PolicyEngine/policyengine-uk-data) - UK microdata generation
- [microdf](https://github.com/PolicyEngine/microdf) - Distributional analysis tools
- [microimpute](https://github.com/PolicyEngine/microimpute) - Imputation methods
- [survey-enhance](https://github.com/PolicyEngine/survey-enhance) - Survey data calibration
- [L0](https://github.com/PolicyEngine/L0) - L0 penalty optimization

### APIs
- [policyengine-api](https://github.com/PolicyEngine/policyengine-api) - Legacy REST API (being deprecated)
- [policyengine-api-v2](https://github.com/PolicyEngine/policyengine-api-v2) - Next-generation API
- [policyengine-household-api](https://github.com/PolicyEngine/policyengine-household-api) - Household-level calculations

### Applications
- [policyengine-app](https://github.com/PolicyEngine/policyengine-app) - Main React web application
- [policyengine-app-v2](https://github.com/PolicyEngine/policyengine-app-v2) - TypeScript next-gen app

### Specialized Tools
- [finsim](https://github.com/PolicyEngine/finsim) - Retirement portfolio simulation
- [mortality](https://github.com/PolicyEngine/mortality) - Mortality calculations

## Technical Notes

### Data Flow
1. **Microdata Generation**: Raw survey data → enhancement/imputation → calibrated microdata
2. **Model Execution**: Parameters + variables + microdata → simulation results
3. **API Processing**: Country models + datasets → cached calculations → client responses
4. **Visualization**: API results → React components → interactive charts

### Technology Stack
- **Backend**: Python (OpenFisca framework, Flask/FastAPI)
- **Frontend**: React (JavaScript/TypeScript), Plotly.js
- **Infrastructure**: Google Cloud Platform (App Engine, Cloud SQL, Cloud Build)
- **Data Processing**: NumPy, Pandas, microdf
- **Caching**: Redis
- **CI/CD**: GitHub Actions, Google Cloud Build

### Deployment Architecture
- **Production**: Google App Engine (auto-scaling)
- **Database**: PostgreSQL (Cloud SQL)
- **Caching**: Redis for computation results
- **CDN**: Static assets served via CDN
- **Monitoring**: Google Cloud Monitoring, custom metrics