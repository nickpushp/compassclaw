<?php
// Server-side secrets + canonical resume for the Compass Claw AI proxy.
// This file is NEVER served to the browser: it is protected by .htaccess
// (Require all denied) AND by the CC_APP guard below, so a direct hit returns
// 403 and nothing leaves the server.
if (!defined('CC_APP')) {
    http_response_code(403);
    die('forbidden');
}

// Groq (primary) — free tier chat models. Fast, higher free limits.
define('GROQ_KEY', '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');

// OpenRouter (fallback) — FREE models only. The tiny balance must not be spent.
define('OPENROUTER_KEY', '<redacted>');

// --------------------------------------------------------------------------
// CANONICAL MASTER RESUME (server-side, authoritative).
// The model NEVER generates contact info, work history, education, or certs.
// It only tailors the summary + reorders skills. PHP assembles the full doc
// from THIS data, so nothing factual can be hallucinated, dropped, or invented.
// --------------------------------------------------------------------------
function cc_master_resume() {
    return [
        'name'  => 'NICHOLAS PERTUSET',
        'title' => 'AI Automation Engineer / Solutions Architect',
        'contact' => [
            'location' => 'Ohio, USA (Open to Remote)',
            'email'    => 'nicholaspertuset@gmail.com',
            'phone'    => '(469) 777-6061',
            'linkedin' => 'linkedin.com/in/nicholaspertuset',
        ],
        // Default summary — used verbatim if the model fails. The tailored
        // summary the model returns replaces this per-job.
        'summary' => 'AI Automation Engineer and Solutions Architect with 5+ years '
                   . 'building CRM systems, workflow automation, and AI-powered tools '
                   . 'that cut manual work and drive measurable business results. Expert '
                   . 'in LLM orchestration, Salesforce and ServiceNow administration, and '
                   . 'end-to-end automation across Make, n8n, and Zapier. Proven record '
                   . 'turning operational bottlenecks into autonomous workflows for 500+ '
                   . 'user environments, maintaining 95%+ SLAs, and reducing manual task '
                   . 'volume by 30%. Salesforce Certified AI Associate and Make.com '
                   . 'Certified Expert.',
        // Canonical skills, grouped. The model returns a reordered flat list of
        // the MOST relevant skills; we render that as a lead "Key Skills" line
        // and keep these grouped categories intact beneath it.
        'skill_groups' => [
            'AI & Automation'      => 'LLM Orchestration, Prompt Engineering, RAG Pipelines, AI Voice Agents (Retell, VAPI, ElevenLabs), OpenAI API, Claude API, Botpress',
            'Automation Platforms' => 'Make.com (Certified Expert), n8n, Zapier (Expert), Power Automate',
            'CRM & Systems'        => 'Salesforce Administration, ServiceNow, Airtable, ClickUp (Certified Admin), CRM Migration',
            'Data & Analysis'      => 'Data Analysis, KPI Reporting, Process Optimization, SQL fundamentals',
            'Methodologies'        => 'Agile, Scrum, DevOps principles, SLA Management, GDPR & CCPA Compliance',
            'Professional'         => 'Stakeholder Management, Technical Documentation, Training & Enablement, Cross-Functional Collaboration',
        ],
        // Flat skill pool the model may draw from when choosing the top relevant set.
        'skill_pool' => 'LLM Orchestration, Prompt Engineering, RAG Pipelines, AI Voice Agents, Retell, VAPI, ElevenLabs, OpenAI API, Claude API, Botpress, Make.com, n8n, Zapier, Power Automate, Salesforce Administration, ServiceNow, Airtable, ClickUp, CRM Migration, Data Analysis, KPI Reporting, Process Optimization, SQL, Agile, Scrum, DevOps, SLA Management, GDPR Compliance, CCPA Compliance, Stakeholder Management, Technical Documentation, Training & Enablement, Cross-Functional Collaboration',
        'experience' => [
            [
                'role'    => 'Founder and AI Automation Engineer',
                'org'     => 'Compass Claw and BioDental AI',
                'loc'     => 'Remote',
                'dates'   => 'November 2025 to Present',
                'bullets' => [
                    'Engineered an autonomous AI patient-intake voice agent for dental practices, reducing administrative overhead by 60%.',
                    'Built AI voice receptionists and intake systems for legal and medical practices, cutting manual intake time by 80% and missed calls by 65%.',
                    'Architected end-to-end automations and custom RAG pipelines syncing data across CRMs and communication platforms.',
                    'Delivered 15+ production automations using Make, n8n, and Zapier with full documentation and client training.',
                ],
            ],
            [
                'role'    => 'CRM and Automation Analyst',
                'org'     => 'SNHU (via Stefanini)',
                'loc'     => 'Remote',
                'dates'   => 'February 2023 to July 2025',
                'bullets' => [
                    'Administered and optimized Salesforce and ServiceNow for 500+ users, maintaining a 95%+ SLA and reducing incidents by 25%.',
                    'Deployed workflow automations using Flow, Process Builder, and Power Automate, cutting manual task volume by 30% and operational costs by 15%.',
                    'Led quarterly business reviews that drove 95%+ platform adoption across departments.',
                    'Partnered with compliance teams to deliver GDPR and CCPA-compliant platform enhancements.',
                    'Provided Tier-2 technical support and managed escalations across Support, Product, and Billing.',
                ],
            ],
            [
                'role'    => 'District Manager',
                'org'     => 'Verizon Wireless',
                'loc'     => 'Ohio Region',
                'dates'   => 'January 2020 to January 2023',
                'bullets' => [
                    'Managed 12 retail locations and 150+ employees, growing district revenue 22% year over year.',
                    'Implemented data-driven inventory and sales workflow systems, reducing discrepancies by 35% and overhead by 18%.',
                    'Co-hosted partner enablement and training sessions, increasing partner-sourced leads by 18%.',
                ],
            ],
            [
                'role'    => 'Data Analyst',
                'org'     => 'AT&T',
                'loc'     => '',
                'dates'   => 'April 2009 to October 2012',
                'bullets' => [
                    'Analyzed large-scale datasets to surface patterns and anomalies supporting operational decisions for systems serving millions of users.',
                    'Collaborated with cross-functional IT teams on data infrastructure and automated reporting pipelines.',
                ],
            ],
        ],
        'education' => [
            'Bachelor of Science in Business Administration (Computer Science emphasis) — Saint Catharine College',
        ],
        'certifications' => [
            'Salesforce Certified AI Associate (2025)',
            'Make.com Certified Expert (2025)',
            'ClickUp Administrator Certificate (2025)',
            'Zapier Expert (2024)',
        ],
    ];
}
