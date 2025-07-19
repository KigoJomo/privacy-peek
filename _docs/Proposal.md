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