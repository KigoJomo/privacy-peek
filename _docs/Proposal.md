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

### 4.1 AI-Enabled Policy Analysis Approaches

Addressing the problem of complex privacy policies that users cannot understand, researchers have developed automated analysis systems. Harkous et al. (2018) created Polosis, which uses deep learning to extract and categorize privacy policy clauses, demonstrating that AI can successfully parse policy documents across multiple categories. However, their approach requires substantial computational resources and focuses on legal compliance rather than user empowerment. Zaeem et al. (2022) developed PrivacyCheck v3 with machine learning capabilities for policy analysis, but their system primarily provides summarization without the structured categorical scoring needed for user decision-making.

### 4.2 Privacy Scoring and Assessment Methodologies

Prior work has attempted to transform complex policy information into actionable insights through scoring mechanisms. Zaeem et al. (2020) implemented machine learning-based scoring in PrivacyCheck v2, but focused on basic policy recap rather than weighted category-specific evaluation. The gap identified in current solutions is the lack of standardized scoring that allows meaningful comparisons between websites' privacy practices, which is essential for addressing users' inability to evaluate privacy trade-offs effectively.

### 4.3 Real-Time Privacy Information Delivery

The problem of providing privacy information at decision points has been addressed through browser-based tools. Zaeem et al. (2022) developed a browser extension for PrivacyCheck v3 that detects policy pages and provides summaries, demonstrating feasibility of real-time integration. However, existing solutions lack contextual scoring at critical moments like login pages, where users need immediate privacy insights to make informed consent decisions.

### 4.4 User-Centered Privacy Information Presentation

Research confirms that current privacy communication methods fail users. Steinfeld (2016) found through eye-tracking studies that users spend less than 30 seconds scanning policies before agreeing, while Milne et al. (2006) showed policies have become increasingly complex over time. This directly relates to the core problem of uninformed consent. Existing tools like Polosis and PrivacyCheck focus on legal or technical audiences rather than presenting information in formats accessible to average users, highlighting the need for simplified scoring with plain-language reasoning statements.

## 5. Proposed System Architecture

### 5.1 System Overview

Privacy Peek's proposed design employs a serverless architecture centered around Convex as the backend infrastructure. The system consists of four main components: a Convex backend for data storage and AI processing, a Next.js web dashboard, a Plasmo Chrome extension, and Google's Gemini AI for policy analysis.

### 5.2 Core Components

**Convex Backend**: Serves as the central hub managing `sites` and `tags` tables, exposing HTTP actions as API endpoints for consistent data access across applications.

**AI Analysis Engine**: Leverages Google Gemini to process privacy policies across five categories (Data Collection, Data Sharing, Data Retention and Security, User Rights and Controls, Transparency and Clarity) using 10-point rubrics, generating numerical scores and reasoning statements.

**Web Dashboard (Next.js)**: Responsive application built with TypeScript and TailwindCSS providing search functionality, comparative analysis, detailed score breakdowns, and automated re-analysis scheduling.

**Chrome Extension (Plasmo)**: Browser extension detecting login pages and policy visits to display contextual privacy scores through popup interface, communicating with Convex via HTTP actions.

### 5.3 Data Flow and Technology Justification

![Privacy Peek System Architecture](system%20architecture.png)

The system follows unidirectional data flow: user requests trigger Convex actions that initiate AI analysis, generate scores, store results in the database, and serve data to both client applications through real-time queries.

**Convex** provides real-time capabilities, automatic scaling, and TypeScript-first development without separate API management. **Plasmo** offers modern Chrome extension development with hot reloading. **Next.js** enables server-side rendering for performance, while **Google Gemini** delivers affordable, accurate natural language understanding. **TailwindCSS** ensures consistent styling across components.

The serverless architecture automatically scales based on demand, with Convex providing built-in authentication and real-time subscriptions for secure data access.

### 5.4 Security and Scalability Considerations

The serverless architecture automatically handles scaling based on demand, while Convex's built-in authentication and real-time subscriptions ensure secure data access. The modular design allows independent scaling of different components, with the AI analysis engine designed to handle batch processing for efficient resource utilization during automated re-analysis cycles.

## 6. Methodology

### 6.1 Development Approach

This project will follow an Agile development methodology with 2-week sprints, allowing for iterative development and continuous integration of feedback from classmates and peer testers. The Agile approach is particularly suitable given the need to refine AI analysis accuracy based on testing results and user feedback throughout the development cycle.

### 6.2 Development Phases

#### Phase 1: Foundation Setup (Weeks 1-3)

- Initialize Convex project with database schema for `sites` and `tags` tables
- Set up Next.js dashboard and Plasmo extension environments with TypeScript and TailwindCSS
- Create basic Convex HTTP actions and UI wireframes

#### Phase 2: Core AI Engine Development (Weeks 4-7)

- Implement policy discovery and content parsing using Google Gemini
- Develop privacy scoring algorithm across 5 categories with weighted rubrics
- Connect AI analysis results to Convex database through mutations

#### Phase 3: Frontend Development (Weeks 8-10)

- Build responsive Next.js interface with search and comparison tools
- Develop Plasmo Chrome extension with popup interface
- Integrate both frontends with Convex backend and conduct user testing

#### Phase 4: Integration and Deployment (Weeks 11-12)

- System integration and performance optimization
- Final testing with 30 diverse websites and deployment preparation

### 6.3 AI Implementation Strategy

**Model Selection**: Google Gemini was chosen for its document analysis capabilities, providing both structured JSON output for scoring and natural language explanations. The focus is on prompt engineering and validation rather than model training.

**Testing Approach**: Validate scoring consistency across multiple analysis runs (target: <15% variance) and gather user feedback on score usefulness and clarity from coursemates.

**Ethical Use**: The AI serves as an analysis tool, not legal advice. Clear disclaimers will communicate that scores are informational and encourage users to read full policies for critical decisions.

### 6.4 Progress Tracking

**Sprint Structure**: Each 2-week sprint includes planning sessions, mid-sprint progress reviews, and retrospectives to evaluate completed work.

**Key Milestones**:

- Week 3: Convex backend operational with basic AI integration
- Week 7: AI engine functional with validated accuracy
- Week 10: Both web dashboard and Chrome extension operational
- Week 12: Full system deployed and tested with 30 websites

**Risk Management**: Early AI testing with diverse policies, parallel frontend development, and built-in buffer time for technical challenges.

## 7. Timeline

### 7.1 Project Schedule Overview

The Privacy Peek platform will be developed over a 12-week period using an Agile methodology with 2-week sprints. The timeline is structured around four main phases, each building upon the previous phase's deliverables while allowing for iterative feedback and refinement.

### 7.2 Detailed Timeline

| Week                                    | Objective                                                        | Start   | End     | Duration | Dependencies                   |
| --------------------------------------- | ---------------------------------------------------------------- | ------- | ------- | -------- | ------------------------------ |
| **Phase 1: Foundation Setup**           |
| 1                                       | Initialize Convex backend and define database schema             | Week 1  | Week 1  | 1 week   | Project approval               |
| 2                                       | Set up Next.js dashboard and Plasmo extension environments       | Week 2  | Week 2  | 1 week   | Convex setup complete          |
| 3                                       | Create basic Convex HTTP actions and UI wireframes               | Week 3  | Week 3  | 1 week   | Development environments ready |
| **Phase 2: Core AI Engine Development** |
| 4-5                                     | Implement policy discovery and content parsing modules           | Week 4  | Week 5  | 2 weeks  | Backend foundation complete    |
| 6-7                                     | Develop privacy scoring algorithm and category analysis          | Week 6  | Week 7  | 2 weeks  | AI integration functional      |
| **Phase 3: Frontend Development**       |
| 8                                       | Build Next.js web dashboard with search functionality            | Week 8  | Week 8  | 1 week   | AI engine operational          |
| 9                                       | Develop Plasmo Chrome extension with popup interface             | Week 9  | Week 9  | 1 week   | Web dashboard complete         |
| 10                                      | Integrate frontends with Convex backend and conduct user testing | Week 10 | Week 10 | 1 week   | Both frontends built           |
| **Phase 4: Integration and Deployment** |
| 11                                      | System integration, performance optimization, and testing        | Week 11 | Week 11 | 1 week   | All components functional      |
| 12                                      | Final testing with 30 websites, deployment, and documentation    | Week 12 | Week 12 | 1 week   | System integration complete    |

### 7.3 Key Milestones

- **Week 3**: MVP Backend - Convex operational with basic schema and HTTP actions
- **Week 7**: AI Engine Complete - Functional privacy analysis with 5-category scoring
- **Week 10**: Frontend MVP - Both web dashboard and Chrome extension operational
- **Week 12**: Production Ready - Full system deployed with 30 analyzed websites

### 7.4 Critical Dependencies

**External Dependencies:**

- Google Gemini API access and rate limits
- Chrome Web Store developer account setup
- Convex hosting reliability and performance

**Internal Dependencies:**

- Successful AI prompt engineering for consistent analysis
- User feedback integration from coursemate testing sessions
- Performance optimization to meet 30-second analysis time targets

**Risk Mitigation:**

- Early AI testing with diverse policy structures (Week 4-5)
- Parallel frontend development to reduce timeline pressure
- Buffer time built into each phase for unexpected technical challenges

## 8. Budget

### 8.1 Project Cost Breakdown

The Privacy Peek platform is designed to minimize development costs by leveraging free and low-cost services during the initial development and MVP phases.

| Item                                    | Cost (KSh) | Justification                                                             |
| --------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| Chrome Web Store Developer Registration | 645        | One-time fee ($5) required for publishing the browser extension           |
| Domain Name Registration                | 1,500      | Annual cost for professional domain (truehost.co.ke or similar registrar) |
| Documentation Printing                  | 300        | Final report printing and binding for submission                          |
| **Total Estimated Cost**                | **2,445**  |                                                                           |

### 8.2 Free Resources and Services

**Hosting and Infrastructure:**

- **Convex Backend**: Free tier provides sufficient database operations and serverless functions for development and initial testing
- **Vercel Deployment**: Free hosting for the Next.js web dashboard with automatic deployments
- **Google Gemini API**: Free tier includes generous rate limits suitable for MVP development and testing with 30 websites

## 9. Ethical Considerations

### 9.1 Data Privacy and Security

Privacy Peek will process publicly available privacy policies and terms of service documents without collecting or storing personal user data. The system will store only website metadata, analysis results, and privacy scores in the Convex database. User browsing patterns and personal information will not be tracked or recorded by either the web dashboard or Chrome extension.

All data processing will occur through secure HTTPS connections, and the Convex backend provides built-in authentication and data encryption. The AI analysis will operate on publicly accessible policy documents, ensuring no unauthorized access to private or sensitive information.

### 9.2 AI Bias and Transparency

The Google Gemini model(s) may exhibit inherent biases in interpreting privacy policies, particularly those from different legal jurisdictions or cultural contexts. To address this limitation, the system will provide clear disclaimers that scores are informational tools, not legal advice, and encourage users to read full policies for critical decisions.

The platform will promote transparency by displaying simple reasoning statements alongside numerical scores, allowing users to understand the basis for each privacy assessment. Open-source components (Plasmo, Next.js, TailwindCSS) will be used responsibly under their respective licenses, with proper attribution maintained in project documentation.

The system will be designed with accessibility in mind, using semantic HTML structures and ensuring keyboard navigation compatibility for users with disabilities.

## 10. References

Ermakova, T., Fabian, B., Bender, B., & Klimek, E. (2014). Privacy policies and users' trust: Does readability matter? _Proceedings of the 27th Bled eConference_, 445-456. Retrieved from https://www.academia.edu/31400592/Privacy_Policies_and_Users_Trust_Does_Readability_Matter

Google AI. (2024). _Gemini API documentation_. Retrieved from https://ai.google.dev/gemini-api/docs

Harkous, H., Fawaz, K., Lebret, R., Schaub, F., Shin, K. G., & Aberer, K. (2018). Polisis: Automated analysis and presentation of privacy policies using deep learning. _Proceedings of the 27th USENIX Security Symposium_, 531-548. Retrieved from https://www.usenix.org/system/files/conference/usenixsecurity18/sec18-harkous.pdf

Plasmo Framework. (2024). _Plasmo browser extension framework_. Retrieved from https://www.plasmo.com

Steinfeld, N. (2016). "I agree to the terms and conditions": (How) do users read privacy policies online? An eye-tracking experiment. _Computers in Human Behavior_, 55, 992-1000. Retrieved from https://cris.ariel.ac.il/en/publications/i-agree-to-the-terms-and-conditions-how-do-users-read-privacy-pol-3

Zaeem, R. N., German, R. L., & Barber, K. S. (2022). PrivacyCheck v3: Empowering users with higher-level understanding of privacy policies. _ACM Transactions on Internet Technology_, 22(1), 1-24. Retrieved from https://dl.acm.org/doi/abs/10.1145/3488560.3502184

---

**AI Tool Usage Declaration:**

Claude Sonnet 4 was used for:

- Code autocompletion and syntax suggestions during prototype development
- Debugging assistance and error resolution
- Brainstorming architectural approaches and component design patterns
- Text refinement and grammar checking in documentation
- Prototype testing strategies and implementation guidance

All AI-generated code suggestions were reviewed, modified, and integrated based on project-specific requirements. The core project concept, objectives, methodology, and technical decisions remain original work.
