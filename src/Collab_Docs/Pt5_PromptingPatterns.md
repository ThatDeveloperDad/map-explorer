# Effective Prompting Patterns

## Clear Requirements

- Specific goals
- Technical constraints
- Expected behavior

## Context Management

- Relevant code snippets
- Architecture decisions
- Previous discussions

## Iteration Strategies

- Review and refinement
- Alternative approaches
- Error handling

## Human Focus: Effective AI Collaboration

- **Context Management**

  - Providing relevant architectural context
  - Maintaining focus on design principles
  - Example: Explaining entity abstraction requirements

- **Incremental Guidance**

  - Breaking complex requirements into manageable chunks
  - Steering AI toward maintainable solutions
  - Building on previous architectural decisions

- **Quality Control**
  - Reviewing generated code against requirements
  - Ensuring consistency with existing patterns
  - Identifying areas needing refinement

### Real-world Example

From our project:

```javascript
// Initial prompt: "We need movement controls"
// Refined prompt after architectural consideration:
"We need movement controls that:
1. Work with any entity type
2. Support different movement rules
3. Maintain separation between UI and game logic"
```
