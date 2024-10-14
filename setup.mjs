export function setup(ctx) {
    ctx.settings.section('Astrology').add({
      type: 'switch',
      name: 'astrology-auto-level',
      label: 'Auto level Astrology',
      hint: 'Automatically study the highest level constellation you can',
      default: true
    });

    ctx.settings.section('Astrology').add({
      type: 'number',
      min: 1,
      max: 100,
      name: 'astrology-auto-level-max-mastery',
      label: 'Astrology Max Mastery Level',
      hint: 'Maximum mastery level to study up to before going to the previous constellation (set to 100 for unlimited studying of the higest level constellation)',
      default: 100
    });

    ctx.settings.section('Woodcutting').add({
      type: 'switch',
      name: 'woodcutting-auto-level',
      label: 'Auto Level Woodcutting',
      hint: 'Automatically cut the highest level tree you can',
      default: true
    });

    ctx.settings.section('Woodcutting').add({
      type: 'number',
      min: 1,
      max: 100,
      name: 'woodcutting-auto-level-max-mastery',
      label: 'Woodcutting Max Mastery Level',
      hint: 'Maximum mastery level to cut up to before going to the previous tree (set to 100 for unlimited cutting of the higest level tree)',
      default: 100
    });

    ctx.settings.section('Fishing').add({
      type: 'switch',
      name: 'fishing-auto-level',
      label: 'Auto Level Fishing',
      hint: 'Automatically fish the highest level fish you can',
      default: true
    });

    ctx.settings.section('Fishing').add({
      type: 'number',
      min: 1,
      max: 100,
      name: 'fishing-auto-level-max-mastery',
      label: 'Fishing Max Mastery Level',
      hint: 'Maximum mastery level to fish up to before going to the previous fish (set to 100 for unlimited fishing of the higest level fish)',
      default: 100
    });
    
    ctx.settings.section('Mining').add({
      type: 'switch',
      name: 'mining-auto-level',
      label: 'Auto Level mining',
      hint: 'Automatically mine the highest level rock you can',
      default: true
    });

    ctx.settings.section('Mining').add({
      type: 'number',
      min: 1,
      max: 100,
      name: 'mining-auto-level-max-mastery',
      label: 'Mining Max Mastery Level',
      hint: 'Maximum mastery level to mine up to before going to the previous rock (set to 100 for unlimited mining of the higest level rock)',
      default: 100
    });
  
  
    ctx.patch(Astrology, 'postAction').after(function() {

      if(!ctx.settings.section('Astrology').get('astrology-auto-level')) {
        return
      }

      //sort the action with the highest baseExperience
      let actions = game.astrology.actions.allObjects
      let accessFilter = actions.filter(action => game.astrology._level >= action.level)
      let masterFilter = accessFilter.filter(action => game.astrology.getMasteryLevel(action) < ctx.settings.section('Astrology').get('astrology-auto-level-max-mastery'))

      let final = null

      if (masterFilter.length === 0) {
        final = accessFilter
      } else {
        final = masterFilter
      }

      final.sort((a, b) => b.baseExperience - a.baseExperience)

      if (game.astrology.activeConstellation !== final[0]) {
        console.log('Change Active Constellation: ','action.level', final[0].level, 'game.astrology._level', game.astrology._level, 'action', final[0])
        game.astrology.studyConstellationOnClick(final[0])
      }

      // actions.sort((a, b) => b.baseExperience - a.baseExperience)

      
      // //loop through actions
      // for (let action of actions) {
      //   //if game.astrology._level >= action.level
      //   if (game.astrology._level >= action.level && game.astrology.getMasteryLevel(action) < ctx.settings.section('Astrology').get('astrology-auto-level-max-mastery')) {
      //     if (game.astrology.activeConstellation === action) {
      //       break
      //     } else {
      //       console.log('Change Active Constellation: ','action.level', action.level, 'game.astrology._level', game.astrology._level, 'action', action)
      //       game.astrology.studyConstellationOnClick(action)
      //       //break out of loop
      //       break         
      //     }
      //   }
      // }

    })

    ctx.patch(Woodcutting, 'postAction').after(function() {

      if(!ctx.settings.section('Woodcutting').get('woodcutting-auto-level')) {
        return
      }
      
      //sort the action with the highest baseExperience
      let actions = game.woodcutting.actions.allObjects
      let accessFilter = actions.filter(action => game.woodcutting.isTreeUnlocked(action) )
      let masterFilter = accessFilter.filter(action => game.woodcutting.getMasteryLevel(action) < ctx.settings.section('Woodcutting').get('woodcutting-auto-level-max-mastery'))

      let final = null

      if (masterFilter.length === 0) {
        final = accessFilter
      } else {
        final = masterFilter
      }

      final.sort((a, b) => b.baseExperience - a.baseExperience)

      if (!game.woodcutting.activeTrees.has(final[0])) {
        console.log('Change Active Tree: ','action.level', final[0].level, 'game.woodcutting._level', game.woodcutting._level, 'action', final[0])
        game.woodcutting.activeTrees.clear()
        game.woodcutting.selectTree(final[0])
        if (final.length > 1) {
          game.woodcutting.selectTree(final[1])
        }
      }


      // //loop through actions
      // for (let action of actions) {
      //   if (game.woodcutting.isTreeUnlocked(action) && game.woodcutting.getMasteryLevel(action) < ctx.settings.section('Woodcutting').get('woodcutting-auto-level-max-mastery')) {
      //     // if active tree set has action in it
      //     if (game.woodcutting.activeTrees.has(action)){
      //       break
      //     } else {
      //       console.log('Change Active Tree: ','action.level', action.level, 'game.woodcutting._level', game.woodcutting._level, 'action', action)
      //       game.woodcutting.activeTrees.clear()
      //       game.woodcutting.selectTree(action)
      //       //break out of loop
      //       break
      //     }
      //   }
      // }

    })

    ctx.patch(Fishing, 'postAction').after(function() {

      if(!ctx.settings.section('Fishing').get('fishing-auto-level')) {
        return
      }
      
      //sort the action with the highest baseExperience
      let actions = game.fishing.actions.allObjects
      let accessFilter = actions.filter(action => (!action.area.isSecret || (action.area.isSecret && game.fishing.secretAreaUnlocked === true)) 
        && (action.area.poiRequirement === undefined || action.area.poiRequirement.pois[0].isDiscovered === true) 
        && (game.fishing._level >= action.level)
        && (!game.fishing.activeFish.area.requiredItem || game.fishing.activeFish.area.requiredItem.occupiesSlots.length > 0)
      )
      let masterFilter = accessFilter.filter(action => game.fishing.getMasteryLevel(action) < ctx.settings.section('Fishing').get('fishing-auto-level-max-mastery'))

      let final = null

      if (masterFilter.length === 0) {
        final = accessFilter
      } else {
        final = masterFilter
      }

      final.sort((a, b) => b.baseExperience - a.baseExperience)

      if (game.fishing.activeFish !== final[0]) {
        console.log('Change Active Fish: ','action.level', final[0].level, 'game.fishing._level', game.fishing._level, 'action', final[0])          
        game.fishing.onAreaFishSelection(final[0].area, final[0])
        game.fishing.onAreaStartButtonClick(final[0].area)
      }

      // //loop through actions
      // for (let action of actions) {
      //   if (game.fishing._level >= action.level && game.fishing.getMasteryLevel(action) < ctx.settings.section('Fishing').get('fishing-auto-level-max-mastery')) {
      //     // if active tree set has action in it
      //     if (game.fishing.activeFish === action){
      //       break
      //     } else if ((!action.area.isSecret || (action.area.isSecret && game.fishing.secretAreaUnlocked === true))){
      //       if(action.area.poiRequirement === undefined || action.area.poiRequirement.pois[0].isDiscovered === true){
      //         console.log('Change Active Fish: ','action.level', action.level, 'game.fishing._level', game.fishing._level, 'action', action)          
      //         game.fishing.onAreaFishSelection(action.area, action)
      //         game.fishing.onAreaStartButtonClick(action.area)
      //         //break out of loop
      //         break
      //       }
      //     }
      //   }
      // }

    })

    ctx.patch(Mining, 'postAction').after(function() {

      if(!ctx.settings.section('Mining').get('mining-auto-level')) {
        return
      }

      //sort the action with the highest baseExperience
      let actions = game.mining.actions.allObjects
      let accessFilter = actions.filter(action => game.mining._level >= action.level 
        && game.mining.canMineOre(action) && !action.isRespwaning && action.currentHP > 0
      )
      let masterFilter = accessFilter.filter(action => game.mining.getMasteryLevel(action) < ctx.settings.section('Mining').get('mining-auto-level-max-mastery'))

      let final = null

      if (masterFilter.length === 0) {
        final = accessFilter
      } else {
        final = masterFilter
      }

      final.sort((a, b) => b.baseExperience - a.baseExperience)

      if (game.mining.selectedRock !== final[0]) {
        console.log('Change Active Rock: ','action.level', final[0].level, 'game.mining._level', game.mining._level, 'action', final[0])
        game.mining.onRockClick(final[0])
      }

      // actions.sort((a, b) => b.baseExperience - a.baseExperience)

      // //loop through actions
      // for (let action of actions) {
      //   //if game.mining._level >= action.level
      //   if (game.mining._level >= action.level && game.mining.getMasteryLevel(action) < ctx.settings.section('Mining').get('mining-auto-level-max-mastery')) {
      //     if (game.mining.canMineOre(action) && !action.isRespwaning && action.currentHP > 0) {
      //       if (game.mining.selectedRock === action) {
      //         break
      //       } else {
      //         console.log('Change Active Rock: ','action.level', action.level, 'game.mining._level', game.mining._level, 'action', action)
      //         game.mining.onRockClick(action)
      //         //break out of loop
      //         break
      //       }
      //     }
      //   }
      // }

    })

    

  }