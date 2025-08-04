/**
 * Agent Generator Tool
 * Creates new AI agents based on requirements
 */

export class AgentGenerator {
  constructor() {
    this.templatePath = './agents/agent-factory/templates/';
    this.agentsPath = './agents/';
  }

  /**
   * Generate a new agent based on requirements
   * @param {Object} requirements - Agent requirements
   * @returns {Object} Generated agent configuration
   */
  async generateAgent(requirements) {
    const {
      name,
      description,
      capabilities,
      domain,
      tools = []
    } = requirements;

    const agentConfig = {
      name: this.sanitizeName(name),
      description,
      version: "1.0.0",
      capabilities,
      tools: this.getRequiredTools(capabilities, tools),
      context: {
        project: "zirk.it",
        domain,
        tech_stack: ["Next.js", "Supabase", "OpenAI", "Tailwind CSS"]
      },
      prompts: this.generatePrompts(description, capabilities, domain)
    };

    return agentConfig;
  }

  /**
   * Get required tools based on capabilities
   * @param {Array} capabilities - Agent capabilities
   * @param {Array} additionalTools - Additional tools requested
   * @returns {Array} List of required tools
   */
  getRequiredTools(capabilities, additionalTools = []) {
    const toolMap = {
      'file-operations': ['Read', 'Write', 'Edit', 'MultiEdit'],
      'web-scraping': ['WebFetch', 'Grep'],
      'database-operations': ['mcp__supabase'],
      'code-generation': ['Write', 'Edit', 'MultiEdit'],
      'search-operations': ['Grep', 'Glob'],
      'task-management': ['TodoWrite'],
      'system-operations': ['Bash']
    };

    let requiredTools = new Set(['Read', 'Write']); // Base tools

    capabilities.forEach(capability => {
      const tools = toolMap[capability] || [];
      tools.forEach(tool => requiredTools.add(tool));
    });

    additionalTools.forEach(tool => requiredTools.add(tool));

    return Array.from(requiredTools);
  }

  /**
   * Generate prompts for the agent
   * @param {string} description - Agent description
   * @param {Array} capabilities - Agent capabilities
   * @param {string} domain - Agent domain
   * @returns {Object} Generated prompts
   */
  generatePrompts(description, capabilities, domain) {
    const systemPrompt = `You are a specialized AI agent for Zirk.it focused on ${domain}. 

Your purpose: ${description}

Your capabilities include: ${capabilities.join(', ')}

Context: You are part of the Zirk.it ecosystem, an AI-powered website generator for small businesses. Always consider the project's tech stack (Next.js, Supabase, OpenAI, Tailwind CSS) and business goals when making decisions.

Guidelines:
- Stay focused on your domain of expertise
- Follow Zirk.it coding standards and conventions
- Integrate well with other system components
- Prioritize user experience and business value
- Keep responses concise and actionable`;

    return {
      system: systemPrompt,
      task_execution: `Execute the following task within your domain of ${domain}: {task}. Ensure the solution aligns with Zirk.it's architecture and MVP goals.`,
      error_handling: `Handle the following error in ${domain}: {error}. Provide a clear solution that maintains system stability.`
    };
  }

  /**
   * Sanitize agent name for file system
   * @param {string} name - Raw agent name
   * @returns {string} Sanitized name
   */
  sanitizeName(name) {
    return name.toLowerCase()
               .replace(/\s+/g, '-')
               .replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Create agent directory structure
   * @param {string} agentName - Name of the agent
   * @param {Object} config - Agent configuration
   */
  async createAgentStructure(agentName, config) {
    const agentDir = `${this.agentsPath}${agentName}`;
    
    // This would typically use file system operations
    // For now, returning the structure that should be created
    return {
      directory: agentDir,
      files: [
        `${agentDir}/agent.json`,
        `${agentDir}/prompts/system.md`,
        `${agentDir}/prompts/tasks.md`,
        `${agentDir}/tools/`,
        `${agentDir}/README.md`
      ],
      config
    };
  }
}