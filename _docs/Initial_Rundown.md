# Problem statement
  The problem is that the average internet user does not have the time, resources or expertise to navigate the complex world of online data ownership and privacy. This leads to a lack of understanding and awareness of their rights and options, resulting in uninformed consent and potential misuse of their personal data.

  Users are often required to agree to lengthy and complex policy documents. This creates a barrier to informed consent, as many users do not read or fully understand these documents.

  That being said, the key issue to address is the knowledge gap in data ownership and privacy practices. Bridging this gap would result in users making informed decisions about their data, leading to better data practices and improved online privacy.

# Objectives
1. Develop an AI-enabled system that interprets and summarizes policy documents into simple digestible formats.
    - Achieve basic clause-extraction and summarization within 6 weeks of project start.
2. Design and implement a scoring mechanism that evaluates websites across 5 major privacy categories; Data Collection, Sharing, Retention, User Rights/Controls and Transparency.
    - Generate a 0-10 score pre category and an overall score using a mix of rule-based checks and LLM evaluations to allow users to gauge trustworthiness at a glance.
    - Have the scoring engine within 4 weeks after successful clause-extraction.
3. Create a functional browser extension that displays privacy scores.
    - The extension will detect events such as a login page that asks the user to agree to the website's policies, or a user visits a terms of service or policy page. These along with manually clicking the extension icon will trigger a popup that displays the privacy scores of the current page.
    - Have the extension fully integrated with the scoring engine within 3 weeks of socring engine completion.
4. Build a web-based dashboard that allows users to search, view and compare scores across websites.
    - Have a basic dashboard on the website that displays key metrics and policy summaries.
    - Present an MVP with scores for 30 websites within 3 weeks of completing the scoring engine.