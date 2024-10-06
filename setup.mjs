export function setup(ctx) {
    ctx.settings.section('General').add({
      type: 'switch',
      name: 'astrology-auto-level',
      label: 'Auto level Astrology',
      hint: 'Automatically study the highest level constellation you can',
      default: true
    });

    ctx.settings.section('General').add({
      type: 'switch',
      name: 'woodcutting-auto-level',
      label: 'Auto Level Woodcutting',
      hint: 'Automatically cut the highest level tree you can',
      default: true
    });
  
    ctx.patch(Astrology, 'postAction').after(function() {

      if(!ctx.settings.section('General').get('astrology-auto-level')) {
        return
      }

      //sort the action with the highest baseExperience
      let actions = game.astrology.actions.allObjects
      actions.sort((a, b) => b.baseExperience - a.baseExperience)

      //loop through actions
      for (let action of actions) {
        //if game.astrology._level >= action.level
        if (game.astrology._level >= action.level) {
          if (game.astrology.activeConstellation === action) {
            break
          } else {
            console.log('Change Active Constellation: ','action.level', action.level, 'game.astrology._level', game.astrology._level, 'action', action)
            game.astrology.studyConstellationOnClick(action)
            //break out of loop
            break         
          }
        }
      }

    })

    ctx.patch(Woodcutting, 'postAction').after(function() {

      if(!ctx.settings.section('General').get('woodcutting-auto-level')) {
        return
      }
      
      //sort the action with the highest baseExperience
      let actions = game.woodcutting.actions.allObjects
      actions.sort((a, b) => b.baseExperience - a.baseExperience)

      //loop through actions
      for (let action of actions) {
        if (game.woodcutting.isTreeUnlocked(action)) {
          // if active tree set has action in it
          if (game.woodcutting.activeTrees.has(action)){
            break
          } else {
            console.log('Change Active Tree: ','action.level', action.level, 'game.woodcutting._level', game.woodcutting._level, 'action', action)
            game.woodcutting.activeTrees.clear()
            game.woodcutting.selectTree(action)
            //break out of loop
            break
          }
        }
      }

    })
    
}