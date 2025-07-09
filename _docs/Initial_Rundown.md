# Problem statement
  The problem is that the average internet user does not have the time, resources or expertise to navigate the complex world of online data ownership and privacy. This leads to a lack of understanding and awareness of their rights and options, resulting in uninformed consent and potential misuse of their personal data.

  Users are often required to agree to lengthy and complex policy documents. This creates a barrier to informed consent, as many users do not read or fully understand these documents.

  That being said, the key issue to address is the knowledge gap in data ownership and privacy practices. Bridging this gap would result in users making informed decisions about their data, leading to better data practices and improved online privacy.

# Objectives

By November 2025, I will have completed the following milestones:
1. Develop an AI-enabled policy analysis engine that discovers, interprets and summarizes policy documents into simple digestible formats.
    - Achieve three core functionalities:
        - Discover policy url to automatically find privacy policy and terms of service URLs,
        - Parse and analyze the content from the discovered URLs to extract relevant clauses across 5 privacy categories; Data Collection, Sharing, Retention, User Rights/Controls and Transparency.
        - Get website metadata, i.e., site name, normalized URL, and tags for database storage.
    - Successfully process policy documents and extract clauses with relevance scores ≥0.3 for each of the 5 categories
    - Complete within 3 weeks of project start, with basic clause extraction returning structured clauses and metadata for any website with a privacy policy or terms of service.

2. Design and implement a scoring mechanism that evaluates relevant policy clauses across the 5 major privacy categories.
    - Develop a privacy scoring algorithm that evaluates extracted policy clauses using weighted rubrics to generate category-specific scores (0-10) and an overall privacy score (0-100), supported by reasoning statements written in simple non-technical language.
    - Complete implementation of the scoring engine within 3 weeks after completion of the policy analysis engine.

3. Create a functional browser extension that displays privacy scores.
    - The extension will detect events such as a login page that asks the user to agree to the website's policies, or a user visits a terms of service or policy page. These along with manually clicking the extension icon will trigger a popup that displays the privacy scores of the current page
    - Have the extension fully integrated with the scoring engine and published on Chrome Web Store within 3 weeks of scoring engine completion.

4. Build a responsive web-based dashboard.
    - The dashboard will feature the following:
        - search functionality to find specific websites,
        - comparative analysis tools to evaluate privacy scores across multiple sites,
        - detailed score breakdowns for a database of pre-analyzed websites,
        - automated re-analysis on a bi-weekly basis to ensure up-to-date information.
    - Present an MVP with scores for 30 websites within 3 weeks of completing the scoring engine.

---

# Objectives (Following SMART criteria)
By November 2025, I will have completed the following milestones:
## 1. AI-Enabled Policy Analysis Engine
**Specific**: Develop an engine with three core functionalities: URL discovery, content parsing/analysis, and metadata extraction across 5 privacy categories (Data Collection, Sharing, Retention, User Rights/Controls, Transparency).

**Measurable**: Successfully extract clauses with relevance scores ≥0.3 for each of the 5 categories, returning structured clauses and metadata for any website with privacy policies.

**Achievable**: Building on existing NLP and web scraping technologies, with clear technical requirements and defined output formats.

**Relevant**: Addresses the core problem of making complex policy documents digestible and understandable for average users.

**Time-bound**: Complete within 3 weeks of project start.

## 2. Privacy Scoring Mechanism
**Specific**: Design and implement a scoring algorithm that evaluates extracted policy clauses using weighted rubrics to generate category-specific scores (0-10) and overall privacy scores (0-100).

**Measurable**: Produce numerical scores with supporting reasoning statements written in simple, non-technical language for each privacy category.

**Achievable**: Based on established scoring methodologies and the structured data output from the analysis engine.

**Relevant**: Transforms complex policy information into actionable insights that users can easily understand and compare.

**Time-bound**: Complete implementation within 3 weeks after completion of the policy analysis engine.

## 3. Browser Extension
**Specific**: Create a Chrome extension that detects login pages, policy page visits, and manual icon clicks to display privacy scores in a popup interface.

**Measurable**: Extension fully integrated with scoring engine and published on Chrome Web Store with functional popup displaying privacy scores.

**Achievable**: Leverages standard browser extension APIs and existing scoring infrastructure.

**Relevant**: Provides real-time privacy information at the point of user decision-making.

**Time-bound**: Published on Chrome Web Store within 3 weeks of scoring engine completion.

## 4. Web-Based Dashboard
**Specific**: Build a responsive dashboard featuring search functionality, comparative analysis tools, detailed score breakdowns, and automated bi-weekly re-analysis.

**Measurable**: MVP with privacy scores for 30 pre-analyzed websites, fully functional search and comparison features.

**Achievable**: Standard web development practices with integration to existing analysis and scoring systems.

**Relevant**: Provides comprehensive privacy research and comparison capabilities for informed decision-making.

**Time-bound**: Present MVP within 3 weeks of completing the scoring engine, with ongoing bi-weekly updates.

---

# Project Schedule

**Project Start Date: July 1, 2025**  
**Project End Date: November 30, 2025 (Total: 22 weeks)**

| Task ID | Objective/Activity | Start Date | End Date | Duration (Weeks) | Dependencies | Notes |
|---------|-------------------|------------|----------|------------------|--------------|-------|
| **O1** | **Objective 1: AI-Enabled Policy Analysis Engine** | | | | | |
| 1.1 | Set up AI/ML infrastructure and Google Gemini integration | July 1, 2025 | July 8, 2025 | 1 | - | Configure AI SDK, API keys, and testing framework |
| 1.2 | Develop URL discovery functionality | July 8, 2025 | July 15, 2025 | 1 | 1.1 | Implement web scraping for privacy policy and terms URLs |
| 1.3 | Build website metadata extraction | July 15, 2025 | July 22, 2025 | 1 | 1.2 | Extract site name, normalized URL, and tags |
| 1.4 | Implement policy content analysis and clause extraction | July 22, 2025 | Aug 5, 2025 | 2 | 1.3 | Extract clauses across 5 privacy categories with relevance ≥0.3 |
| 1.5 | Testing and validation of analysis engine | Aug 5, 2025 | Aug 12, 2025 | 1 | 1.4 | Ensure accurate clause extraction and metadata generation |
| **O2** | **Objective 2: Privacy Scoring Mechanism** | | | | | |
| 2.1 | Design scoring rubrics and category weights | Aug 12, 2025 | Aug 19, 2025 | 1 | 1.5 | Define weighted scoring criteria for 5 privacy categories |
| 2.2 | Implement category-specific scoring | Aug 19, 2025 | Aug 26, 2025 | 1 | 2.1 | Score individual categories (0-10) with AI-generated reasoning |
| 2.3 | Develop overall scoring algorithm | Aug 26, 2025 | Sep 2, 2025 | 1 | 2.2 | Calculate weighted average and generate user-friendly explanations |
| 2.4 | Integrate scoring with analysis engine | Sep 2, 2025 | Sep 9, 2025 | 1 | 2.3 | Complete end-to-end analysis and scoring pipeline |
| 2.5 | Testing and calibration of scoring system | Sep 9, 2025 | Sep 16, 2025 | 1 | 2.4 | Validate scores against manual analysis and adjust weights |
| **O3** | **Objective 3: Browser Extension** | | | | | |
| 3.1 | Design extension architecture and manifest | Sep 16, 2025 | Sep 23, 2025 | 1 | 2.5 | Plan popup UI, background scripts, and API integration |
| 3.2 | Develop popup interface with privacy score display | Sep 23, 2025 | Sep 30, 2025 | 1 | 3.1 | Create TailwindCSS-styled popup showing scores and breakdowns |
| 3.3 | Implement page detection (login pages, policy pages) | Sep 30, 2025 | Oct 7, 2025 | 1 | 3.2 | Detect policy-related pages and trigger analysis |
| 3.4 | Integrate extension with scoring API | Oct 7, 2025 | Oct 14, 2025 | 1 | 3.3 | Connect extension to `analyzeWebsitePrivacy` endpoint |
| 3.5 | Testing and Chrome Web Store submission | Oct 14, 2025 | Oct 21, 2025 | 1 | 3.4 | Complete testing and publish to Chrome Web Store |
| **O4** | **Objective 4: Web-Based Dashboard** | | | | | |
| 4.1 | Design responsive dashboard UI/UX | Oct 21, 2025 | Oct 28, 2025 | 1 | 3.5 | Create search, comparison, and detailed view interfaces |
| 4.2 | Implement search functionality and database integration | Oct 28, 2025 | Nov 4, 2025 | 1 | 4.1 | Build search with filtering and sorting capabilities |
| 4.3 | Develop comparative analysis tools | Nov 4, 2025 | Nov 11, 2025 | 1 | 4.2 | Enable side-by-side privacy score comparisons |
| 4.4 | Create detailed score breakdown pages | Nov 11, 2025 | Nov 18, 2025 | 1 | 4.3 | Show category scores, reasoning, and supporting clauses |
| 4.5 | Implement automated re-analysis system | Nov 18, 2025 | Nov 25, 2025 | 1 | 4.4 | Set up bi-weekly re-analysis jobs and update tracking |
| 4.6 | Pre-populate database with 30 analyzed websites | Nov 25, 2025 | Nov 30, 2025 | 1 | 4.5 | Analyze popular websites and populate dashboard |
| **P.M.** | **Project Management & Documentation (Ongoing)** | July 1, 2025 | Nov 30, 2025 | 22 | - | Regular progress meetings, documentation, testing, and risk management |

