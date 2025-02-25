# How I use AI to Make Software Happen

There's a whole lot of hand-wringing going on out there about how AI is coming for our jobs as software developers. There is definitely a clear and present risk for those of us who don't wish to evolve our work style with the times. These LLMs have come a VERY long way in the short couple years that AI Coding Assistants have existed.

As a solo developer interested in launching and maintaining my own software projects as Products, I've learned to embrace AI Assistants in my daily development. In this set of videos, I intend to talk through the process and workflow I've adopted for doing so. After a short climb up the learning curve, I feel like I'm starting to catch my stride, and I've been having a lot of moments where I feel like Tony Stark.

In general, I tend to use Github Copilot as a super-powered Rubber Duck, a Researcher (for looking up detailed synatx matters that I don't keep memorized,) and occasionally, a chat partner while I'm working through detailing architectural ideas, or trying to disprove various hypotheses. It's an excellent tool for these use cases. More recently, I had need of some sophisticated (to me,) javascript on the landing site for The DM's Familiar, so I experimented with using Copilot a little differently. This project was born from that experiment.

For this set of presentations, I'm going to talk through how I built out a proof of concept for something I've been curious about for a long, long time.

## Project Goal

One of the crazier, far-future ideas I have for The DM's Familiar is a utility that the DM can use almost like a Virtual TableTop, but with a twist:

Instead of the top-down or isometric views that other VTT software gives, I want to emulate the old-school first person view from CRPGs like Wizardry, or Eye of the Beholder. In a Browser window.

This side-project is more a Proof of Concept than a Minimum Viable Product. This feature may never see the light of day, but I AM curious to see how far I can evolve this idea.

## Challenges

Because this will need to run in a browser, that means JavaScript, and I'm NOT fluent in that language. I've been slinging .Net with C# for a couple decades, and my strength is in the code-design parts of making software. I've also not done much with graphics programming at all.

## Tools

I'll be working in VS Code, on my Macbook.  
I'm going to stick as close to vanilla Javascript as possible.  
I'm using Vite as the "framework" though I've stripped out most of the "sample" code that gets installed when standing up a new Vite project.  
Github Copilot (paid "Pro" account,) with Claude 3 Sonnet as the model for code generation.

## Approach

I'm taking the role of Product Manager, Designer, Architect, and Tech Lead.  
I've put Copilot (who I'll refer to as "My buddy Claude" from now on,) in the role of developer.  
Through conversations and what's become a RAPID code generation->review->revise-test cycle, we've made significant progress toward the stated goal, in only a few hours of chatting.

## Considerations

Throughout the process, I'm spending most of my Thought Power on:

- Making sure the code that's generated does what's needed.
- Making sure I understand what that code does. (Remember, I don't consider myself a front-end expert by any means.)
- Identifying and calling out areas of potential volatility as they're uncovered, and working with My Buddy to get those encapsulated appropriately. (Yes, Virginia, we CAN have architecture in the Front-End...)
- Guiding Claude through the cycle of: Make it Go, Make it Right, Make it Maintainable.

## The Human Architect's Role

While AI can generate code quickly and suggest implementations, the role of the human architect remains crucial:

- **Domain Understanding**: Maintaining the big picture of what we're building and why
- **Architecture Decisions**: Making informed choices about:
  - Component boundaries
  - State management
  - Data flow
  - Extension points
- **Quality Control**: Ensuring generated code:
  - Follows established patterns
  - Maintains appropriate separation of concerns
  - Remains maintainable and testable
- **Technical Leadership**:
  - Identifying potential architectural risks
  - Planning for future expansion
  - Managing technical debt proactively

The success of this project stems not just from AI's code generation capabilities, but from the continuous architectural guidance providing guardrails for that generation. Without this human oversight, we risk:

- Tightly coupled components
- Unclear responsibilities
- Difficult-to-maintain code
- Poor extensibility
- Technical debt accumulation

Example from this project:

```javascript
// Early movement implementation
game.moveForward();

// Architecturally guided evolution
game.moveEntity(entity, MovementType.MOVE_FORWARD);
```

This evolution shows how architectural thinking leads to more flexible, maintainable code - something an AI might not suggest without proper guidance.

## Stay tuned for subsequent posts. (Coming soon!)
