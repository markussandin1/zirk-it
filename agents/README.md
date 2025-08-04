# Zirk.it Agent System

This directory contains specialized AI agents for different aspects of the Zirk.it project.

## Agent Structure

Each agent is defined in its own subdirectory with:
- `agent.json` - Agent configuration and capabilities
- `prompts/` - Specialized prompts for the agent
- `tools/` - Agent-specific tools and utilities

## Available Agents

- `agent-factory/` - Creates and manages other agents
- `website-generator/` - Generates website content using AI
- `facebook-scraper/` - Extracts content from Facebook pages
- `seo-optimizer/` - Optimizes content for search engines
- `supabase-manager/` - Handles database operations

## Usage

Agents are invoked through the main Claude Code Task tool with specific agent types.