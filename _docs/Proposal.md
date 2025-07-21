## 1. Introduction

The internet serves as a platform for service providers to reach their users anywhere in the world. These services require certain user information in order to deliver value effectively. As such, it is important that users are not made to give away personal information that is irrelevant to the services they are using.

With the increasing complexity of digital services, users often do not understand the scope of information that is actually needed for the services they use. Some service providers may take advantage of this lack of understanding to collect more data than necessary for their own financial gain, leading to potential misuse of personal information.

Discussions around data privacy have become more widespread in recent years, and have seen the emergence of new regulations and standards, for example, the General Data Protection Regulation (GDPR), aimed at protecting user data. However, most of these regulations are still in their infancy, and still leave significant loopholes that can be exploited by service providers. Enforcement of these regulations is also often weak and slow, leaving users vulnerable to excessive data collection and misuse.

Since relying on regulation alone is not sustainable, it is important to empower users with knowledge about their data rights and options. Existing tools and methods, like privacy policies that are required by law, are often too technical for the average user to make sense of. Therefore, it is important to not just provide users with knowledge, but also to present this knowledge in a simple and relatable way that they can understand and use to push back on unnecessary data collection and make informed decisions about their data.

## 2. Problem Statement

The average internet user does not have the time, resources, or expertise to navigate the complex world of online data ownership and privacy. This leads to a lack of understanding and awareness of their rights and options, resulting in uninformed consent and potential misuse of their personal data.

Users are often required to agree to lengthy and complex policy documents. This creates a barrier to informed consent, as many users do not read or fully understand these documents. According to Termly, only 21% of consumers feel confident that their data is being used for proper purposes, while 81% believe the risks of data collection outweigh the benefits. Furthermore, 45% of third-party applications access sensitive user information without good reason, making worse the issue of unnecessary data collection.

The key issue to address is the knowledge gap in data ownership and privacy practices. Bridging this gap by presenting data privacy information in a simple and easy-to-understand way would result in users making informed decisions about their data, leading to better data practices and improved online privacy.

---

## 3. Objectives

### 3.1 General Objective

To develop an AI-powered privacy analysis platform that automatically evaluates privacy policies and terms of service, presenting complex data privacy information in a simplified format that empowers users to make informed decisions about their personal data and digital privacy.

### 3.2 Specific Objectives

1. Develop an AI-enabled policy analysis engine with three core functionalities (URL discovery, content parsing, and metadata extraction) that successfully processes policy documents across 5 privacy categories (Data Collection, Sharing, Retention, User Rights/Controls, Transparency) with relevance scores greater than 0.3, leveraging existing NLP technologies to make complex policies digestible for users.

2. Design and implement a scoring algorithm that evaluates relevant privacy policy clauses using weighted rubrics to generate category-specific scores (0-10) and overall privacy scores (0-100) with simple reasoning statements, building on established methodologies to transform complex policy information into actionable insights.

3. Create a functional Chrome extension that detects login pages, policy page visits, and manual interactions to display integrated privacy scores in a popup interface, providing real-time privacy information at decision-making points and publishing on Chrome Web Store.

4. Build a responsive web-based dashboard featuring search functionality, comparative analysis tools, detailed score breakdowns, and automated bi-weekly re-analysis, delivering an MVP with 30 pre-analyzed websites using standard web development practices.


## 4. Literature Review

### 4.1 Privacy Policy Complexity and User Comprehension

Privacy policies remain a significant barrier to informed user consent due to their complexity and length. Steinfeld (2016) conducted eye-tracking experiments revealing that users rarely read privacy policies entirely, with most spending less than 30 seconds scanning these documents before agreeing. This finding aligns with Ermakova et al. (2014), who demonstrated that policy readability directly impacts user trust, yet most policies are written at graduate-level reading comprehension despite serving general audiences.

The scale of this problem has grown substantially. Milne et al. (2006) found that privacy policies became increasingly lengthy and complex over time, creating what researchers now recognize as a fundamental usability crisis in digital consent mechanisms.

### 4.2 Automated Privacy Policy Analysis Tools

Several attempts have been made to automate privacy policy analysis, though with significant limitations. Zaeem et al. (2022) developed PrivacyCheck v3, a browser extension that summarizes privacy policies using machine learning and provides competitor comparisons. While innovative, their approach focuses primarily on policy summarization rather than actionable scoring, limiting users' ability to make quick privacy decisions at critical moments.

Harkous et al. (2018) created Polisis, which uses deep learning for automated policy analysis and visualization. However, their system requires significant computational resources and lacks real-time integration with user browsing experiences, making it impractical for everyday decision-making scenarios.

### 4.3 Privacy Scoring and Assessment Frameworks

Current privacy assessment approaches lack standardization and user-centered design. Tesfay et al. (2018) developed PrivacyGuide for GDPR compliance evaluation, but their framework targets legal professionals rather than end users. Similarly, existing privacy certification schemes focus on regulatory compliance rather than translating complex policy language into digestible insights for average users.

The absence of real-time, contextual privacy scoring represents a critical gap in current solutions, particularly at decision-making points like account creation or service registration.

### 4.4 Gap Analysis

Existing tools mostly focus on policy summarization or legal compliance rather than empowering users with actionable privacy insights. Current solutions fail to address three key limitations: (1) lack of real-time integration at decision points, (2) absence of standardized scoring mechanisms that enable meaningful comparisons, and (3) limited accessibility for non-technical users looking for quick privacy assessments.

This proposed AI-powered privacy analysis platform addresses these gaps by providing automated policy analysis across five privacy categories (Data Collection, Data Sharing, Data Retention and Security, User Rights and Controls, and Transparency and Clarity) with numerical scoring (0-100) and simple reasoning statements. Unlike existing tools, our approach integrates directly into user workflows through both a Chrome extension and web dashboard, delivering privacy insights precisely when users need them most—at the point of digital service engagement.


## 5. Proposed System Architecture

### 5.1 System Overview

The Privacy Peek platform employs a modern serverless architecture centered around Convex as the primary backend infrastructure. The system consists of four main components: a Convex backend handling data storage and AI processing, a Next.js web dashboard for comprehensive analysis, a Plasmo-based Chrome extension for real-time privacy insights, and external AI services for policy analysis - primarily Google's Gemini AI.

### 5.2 Core Components

#### 5.2.1 Convex Backend
The Convex backend serves as the central hub for all data operations and business logic. It manages two primary tables: `sites` for maintaining website metadata and privacy analysis results, and `tags` for categorization. The backend exposes HTTP actions that serve as API endpoints for both the web dashboard and Chrome extension, ensuring consistent data access patterns across all client applications.

#### 5.2.2 AI Analysis Engine
The analysis engine leverages Google's Gemini AI model through the AI SDK to process privacy policies across five categories: Data Collection, Data Sharing, Data Retention and Security, User Rights and Controls, and Transparency and Clarity. Each category uses a 10-point rubric system, generating both numerical scores and human-readable reasoning statements for user comprehension.

#### 5.2.3 Web Dashboard (Next.js)
The responsive web application provides comprehensive privacy analysis features including website search, comparative analysis tools, detailed score breakdowns, and automated re-analysis scheduling. Built with TypeScript and TailwindCSS, it offers an intuitive interface for users to explore privacy practices across different services.

#### 5.2.4 Chrome Extension (Plasmo)
The Plasmo-based browser extension aims to integrate seamlessly into user browsing workflows, detecting login pages and policy visits to display contextual privacy scores. It communicates with the Convex backend through HTTP actions, providing real-time privacy insights at critical decision-making moments.

### 5.3 Data Flow Architecture

The system follows a unidirectional data flow pattern. When users request privacy analysis through either the web dashboard or browser extension, the request triggers a Convex action that initiates the AI analysis pipeline. The AI engine processes the website's privacy policy, generates category-specific scores and reasoning, then stores the results in the Convex database. Both client applications retrieve this data through Convex queries, ensuring real-time synchronization and consistent user experiences.

### 5.4 Technology Justification

**Convex** was selected for its real-time capabilities, automatic scaling, and TypeScript-first approach, eliminating the need for separate API development and database management. **Plasmo** provides superior Chrome extension development experience with modern web technologies and hot reloading capabilities. **Next.js** offers server-side rendering for improved SEO and performance, while **Google Gemini** provides state-of-the-art, affordable natural language understanding for accurate policy analysis. **TailwindCSS** ensures consistent styling and rapid UI development across all components.

### 5.5 Security and Scalability Considerations

The serverless architecture automatically handles scaling based on demand, while Convex's built-in authentication and real-time subscriptions ensure secure data access. The modular design allows independent scaling of different components, with the AI analysis engine designed to handle batch processing for efficient resource utilization during automated re-analysis cycles.


## 6. Methodology

### 6.1 Development Approach

This project will follow an Agile development methodology with 2-week sprints, allowing for iterative development and continuous integration of feedback from classmates and peer testers. The Agile approach is particularly suitable for this project given the need to refine AI analysis accuracy based on testing results and user feedback throughout the development cycle.

### 6.2 Development Phases

#### 6.2.1 Phase 1: Foundation Setup (Weeks 1-3)
- **Convex Backend Setup**: Initialize Convex project, define database schema for `sites`, and `tags` tables
- **Technology Stack Configuration**: Set up Next.js dashboard and Plasmo extension development environments with TypeScript and TailwindCSS
- **Basic API Structure**: Create initial Convex HTTP actions for data retrieval and storage
- **Initial UI Wireframes**: Design basic interfaces for both web dashboard and browser extension

#### 6.2.2 Phase 2: Core AI Engine Development (Weeks 4-7)
- **Policy Discovery Module**: Implement URL discovery functionality using Google Gemini with search grounding
- **Content Analysis Engine**: Develop the clause extraction system across the 5 privacy categories with relevance scoring
- **Privacy Scoring Algorithm**: Build the weighted rubric system that generates 0-10 category scores and 0-100 overall scores
- **Data Sync Integration**: Connect AI analysis results to Convex database through mutations

#### 6.2.3 Phase 3: Frontend Development (Weeks 8-10)
- **Web Dashboard**: Build responsive Next.js interface with search functionality, detailed score breakdowns, and comparison tools
- **Chrome Extension**: Develop Plasmo-based extension with popup interface and real-time privacy score display
- **API Integration**: Connect both frontends to Convex HTTP actions for seamless data access
- **User Testing**: Conduct testing sessions with 5-8 coursemates to gather initial feedback

#### 6.2.4 Phase 4: Integration and Deployment (Weeks 11-12)
- **System Integration**: Ensure all components work together smoothly, test end-to-end functionality
- **Performance Optimization**: Optimize Convex queries and AI processing for faster response times
- **Final Testing**: Test with 30 diverse websites to validate MVP functionality
- **Deployment**: Deploy web dashboard and prepare Chrome extension for store submission

### 6.3 AI Implementation Strategy

**Why AI is Appropriate**: Privacy policies contain complex legal language that requires natural language understanding to extract meaningful insights. Manual analysis would be time-consuming and inconsistent across different policy structures, making AI essential for scalable automated analysis.

**Model Selection**: Google Gemini was chosen for its strong performance in document analysis and reasoning tasks. The model provides both structured JSON output for scoring and natural language explanations that users can understand. Gemini's search grounding capability is particularly valuable for discovering current policy URLs.

**Prompt Engineering and Testing**: Since I am using a pre-trained model, the focus is on prompt engineering and validation. I will:
- Iterate on prompts and rubrics to improve consistency across the 5 privacy categories
- Validate scoring reliability by comparing results across multiple analysis runs
- Ensure relevance scores above 0.3 filter out irrelevant clauses effectively

**Ethical Use and Limitations**: The AI serves as an analysis tool, not a legal advisor. I will clearly communicate to users that scores are informational and should not replace professional privacy assessment. The system will include disclaimers about AI limitations and encourage users to read full policies for critical decisions.

### 6.4 Data Collection and Evaluation

**Website Selection**: The initial dataset will include 30 popular websites across different categories (social media, e-commerce, productivity tools, news, entertainment) to ensure diverse privacy policy structures and practices.

**Evaluation Metrics**:
- **Consistency**: Measure score variance across multiple analysis runs of the same policy (target: <15% variance)
- **User Satisfaction**: Collect feedback from coursemates and friends on score usefulness and clarity
- **Performance**: Monitor Convex action response times and ensure analysis completes within 30 seconds

### 6.5 Progress Tracking

**Sprint Planning**: Each 2-week sprint will include:
- Sprint planning session with defined deliverables and success criteria
- Mid-sprint progress review to assess development velocity and adjust scope if needed
- Sprint retrospective to evaluate completed work and plan improvements for the next iteration

**Key Milestones**:
- Week 3: Convex backend operational with basic AI integration
- Week 7: AI engine functional with validated accuracy on test policies
- Week 10: Both web dashboard and Chrome extension operational
- Week 12: Full system deployed and tested with 30 websites

**Risk Management**: Identified risks include AI analysis inconsistency, Chrome extension store approval delays, and performance issues with large-scale analysis. Mitigation strategies include early AI testing with diverse policies, parallel development of both frontend applications, and performance optimization from the start of development.

**Feedback Integration**: Regular feedback sessions with coursemates will help refine the user experience and identify usability issues early. This collaborative approach ensures the final product meets user needs while maintaining technical feasibility within the 12-week timeline.

## Timeline