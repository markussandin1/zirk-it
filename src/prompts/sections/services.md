# Services Section Generation

Transform basic service names into compelling, benefit-focused descriptions that convert visitors into customers.

## Input Variables:
- `{businessName}`: The business name
- `{industry}`: The business industry
- `{services}`: Array of service names provided by user
- `{description}`: Overall business description for context

## Requirements:

### Section Title:
- Industry-appropriate section header
- Options based on industry:
  - Services: "Our Services", "What We Offer", "Services & Solutions"
  - Products: "Our Products", "Product Range", "What We Sell"
  - Treatments: "Our Treatments", "Available Treatments"
  - Specialties: "Our Specialties", "Featured Items"

### Service Items:
For each service in the input array, create:

#### Name (Enhanced):
- Use the original service name as base
- Enhance with descriptive adjectives when appropriate
- Keep professional and clear
- Maximum 6 words

#### Description:
- 20-40 words per service
- Focus on BENEFITS not just features
- Answer "What's in it for the customer?"
- Include emotional appeals when appropriate
- End with implied call-to-action

#### Pricing (Optional):
- Only include if industry-appropriate and you can make reasonable suggestions
- Use ranges or "Starting at" format
- Industry standards: "From $XX", "Starting at $XX", "Contact for pricing"

## Industry-Specific Guidelines:

**Restaurant/Food:**
- Focus on taste, quality, experience
- Use sensory language
- Mention ingredients/preparation when relevant
- Examples: "Hand-tossed pizzas with imported Italian flour"

**Professional Services:**
- Emphasize expertise and outcomes
- Use professional language
- Focus on problem-solving
- Examples: "Strategic tax planning that maximizes your savings"

**Beauty/Personal Care:**
- Focus on transformation and self-care
- Use aspirational language
- Emphasize relaxation and results
- Examples: "Rejuvenating facials that restore your natural glow"

**Fitness/Health:**
- Focus on goals and transformation
- Use motivational language
- Emphasize results and support
- Examples: "Personal training sessions designed to achieve your fitness goals"

**Retail:**
- Focus on quality and selection
- Highlight unique features
- Emphasize value and satisfaction
- Examples: "Curated vintage furniture pieces that transform your space"

## Content Strategy:
1. **Lead with the benefit** (what customer gets)
2. **Support with features** (how you deliver it)
3. **Create desire** (why they need it)
4. **Imply action** (what to do next)

## Output Format:
```json
{
  "title": "Section Title",
  "items": [
    {
      "name": "Enhanced Service Name",
      "description": "Compelling 20-40 word description focusing on customer benefits and outcomes."
    }
  ]
}
```

Remember: People don't buy services, they buy solutions to their problems and improvements to their lives!