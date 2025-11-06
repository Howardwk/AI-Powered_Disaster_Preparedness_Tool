class PlanService {
  async generatePlan(options) {
    const {
      location,
      disasterType,
      householdSize,
      specialNeeds,
      coordinates
    } = options;

    const plan = {
      id: this.generatePlanId(),
      location,
      disasterType,
      generatedAt: new Date().toISOString(),
      householdSize,
      specialNeeds: specialNeeds || [],
      sections: []
    };

    // Generate pre-disaster section
    plan.sections.push(this.generatePreDisasterSection(disasterType, householdSize, specialNeeds));

    // Generate during-disaster section
    plan.sections.push(this.generateDuringDisasterSection(disasterType));

    // Generate post-disaster section
    plan.sections.push(this.generatePostDisasterSection(disasterType));

    // Add supplies checklist
    plan.sections.push(this.generateSuppliesSection(disasterType, householdSize, specialNeeds));

    // Add evacuation routes (if coordinates provided)
    if (coordinates) {
      plan.sections.push(this.generateEvacuationSection(coordinates));
    }

    return plan;
  }

  generatePreDisasterSection(type, householdSize, specialNeeds) {
    const actions = {
      hurricane: [
        'Monitor weather updates from reliable sources',
        'Prepare emergency supplies kit (3-7 days of food, water, medications)',
        'Secure outdoor furniture and objects that could become projectiles',
        'Board up windows or install storm shutters',
        'Fill vehicle gas tanks',
        'Charge all electronic devices',
        'Review evacuation routes and identify local shelters',
        'Notify family/friends of your evacuation plan',
        `Prepare important documents in waterproof container`,
        'Move vehicles to higher ground if in flood-prone area'
      ],
      flood: [
        'Monitor water levels and weather forecasts',
        'Move valuables to higher floors or elevated areas',
        'Prepare sandbags if available',
        'Clear gutters and drains',
        'Turn off utilities if instructed',
        'Prepare evacuation kit',
        'Identify evacuation routes to higher ground',
        'Keep vehicle fueled and ready',
        'Charge mobile devices',
        'Stay informed through local emergency services'
      ],
      tornado: [
        'Monitor weather alerts and warnings',
        'Identify safe room (basement, interior room on lowest floor)',
        'Practice tornado drill with household',
        'Secure or bring in outdoor items',
        'Prepare emergency kit',
        'Charge devices and keep weather radio ready',
        'Know the difference between watch and warning',
        'Identify multiple safe locations',
        'Have sturdy shoes and helmet ready',
        'Prepare for power outages'
      ],
      earthquake: [
        'Secure heavy furniture and appliances to walls',
        'Store breakable items in low, closed cabinets',
        'Practice "Drop, Cover, and Hold On" drill',
        'Prepare emergency supply kit',
        'Identify safe spots in each room (under sturdy tables)',
        'Learn how to shut off gas, water, and electricity',
        'Have fire extinguisher ready',
        'Anchor overhead light fixtures',
        'Repair deep cracks in ceilings or foundations',
        'Review earthquake insurance coverage'
      ],
      wildfire: [
        'Create defensible space around property (30 feet minimum)',
        'Remove dead vegetation and flammable materials',
        'Clear gutters and roof of debris',
        'Prepare evacuation kit with important documents',
        'Plan multiple evacuation routes',
        'Keep vehicles fueled and facing exit direction',
        'Close all windows and doors',
        'Place lawn sprinklers if time permits',
        'Move flammable items away from structures',
        'Monitor fire conditions and warnings'
      ]
    };

    return {
      title: 'Pre-Disaster Preparation',
      priority: 'high',
      timeline: 'Do this immediately',
      actions: actions[type] || actions.hurricane,
      checklist: this.generatePreDisasterChecklist(type, householdSize, specialNeeds)
    };
  }

  generateDuringDisasterSection(type) {
    const actions = {
      hurricane: [
        'Stay indoors and away from windows',
        'Use battery-powered radio for updates',
        'If in mobile home or unsafe structure, evacuate to designated shelter',
        'Do not go outside until authorities declare it safe',
        'Avoid using candles (use flashlights instead)',
        'Stay in interior room or hallway on lowest floor',
        'Do not use electrical equipment if wet',
        'Be aware of tornadoes spawned by hurricanes'
      ],
      flood: [
        'Move to highest level of building',
        'Do not walk or drive through flood waters',
        'Avoid contact with flood water (may be contaminated)',
        'Turn off electricity at main breaker if water enters building',
        'Listen to emergency broadcasts',
        'If trapped, signal for help',
        'Do not attempt to swim through fast-moving water',
        'Evacuate immediately if instructed'
      ],
      tornado: [
        'Go to safe room immediately (basement or interior room)',
        'Get under sturdy furniture or cover yourself with mattress',
        'Stay away from windows',
        'Cover your head and neck',
        'Do not leave shelter until threat passes',
        'If in vehicle, get out and seek shelter in low-lying area',
        'If outdoors, lie flat in ditch or depression',
        'Stay informed via weather radio'
      ],
      earthquake: [
        'Drop to your hands and knees',
        'Cover your head and neck with arms',
        'Hold on to sturdy furniture',
        'If indoors, stay there (do not run outside)',
        'Stay away from windows, glass, or heavy objects',
        'If in bed, stay there and cover head with pillow',
        'If outdoors, move to open area away from buildings',
        'If driving, pull over and stay in vehicle',
        'Do not use elevators',
        'Be prepared for aftershocks'
      ],
      wildfire: [
        'Evacuate immediately if ordered',
        'Close all windows and doors',
        'Cover vents and openings',
        'Stay low if smoke is heavy',
        'Wear protective clothing (long sleeves, pants, mask)',
        'Follow evacuation routes (do not take shortcuts)',
        'Drive carefully with headlights on',
        'Listen to emergency broadcasts',
        'If trapped, call 911 and provide your location'
      ]
    };

    return {
      title: 'During the Disaster',
      priority: 'critical',
      timeline: 'Active disaster response',
      actions: actions[type] || actions.hurricane,
      emergencyContacts: ['911', 'Local Emergency Services', 'Red Cross']
    };
  }

  generatePostDisasterSection(type) {
    const actions = {
      hurricane: [
        'Wait for official "all clear" before returning home',
        'Avoid downed power lines',
        'Check for gas leaks before entering building',
        'Use flashlights, not candles',
        'Avoid flood waters (may be contaminated)',
        'Document damage with photos',
        'Contact insurance company',
        'Check on neighbors, especially elderly',
        'Do not use tap water until declared safe',
        'Watch for snakes and other animals displaced by flood'
      ],
      flood: [
        'Return only when authorities say it is safe',
        'Do not enter building if water is still present',
        'Check for structural damage',
        'Turn off electricity if water entered',
        'Clean and disinfect everything that got wet',
        'Check for gas leaks',
        'Document damage for insurance',
        'Boil water before drinking',
        'Watch for electrical equipment and outlets',
        'Contact insurance and FEMA if applicable'
      ],
      tornado: [
        'Wait until storm completely passes',
        'Check for injuries and administer first aid',
        'Avoid damaged buildings',
        'Watch for downed power lines',
        'Check gas lines for leaks',
        'Use flashlights, not candles',
        'Document damage',
        'Contact insurance company',
        'Help neighbors if safe to do so',
        'Be aware of hazards from debris'
      ],
      earthquake: [
        'Check yourself and others for injuries',
        'Check for gas leaks (smell, listen)',
        'Turn off gas if leak is detected',
        'Be prepared for aftershocks',
        'Check for fire hazards',
        'Avoid damaged buildings',
        'Use phone only for emergencies',
        'Document damage',
        'Listen to news for official information',
        'Help neighbors if safe'
      ],
      wildfire: [
        'Wait for official "all clear" before returning',
        'Check for hot spots and smoldering debris',
        'Avoid downed power lines',
        'Watch for ash and debris',
        'Check air quality before removing mask',
        'Document damage with photos',
        'Contact insurance company',
        'Be cautious of unstable structures',
        'Check for injured or dead animals',
        'Avoid using water that may be contaminated'
      ]
    };

    return {
      title: 'Post-Disaster Recovery',
      priority: 'high',
      timeline: 'After the disaster passes',
      actions: actions[type] || actions.hurricane,
      resources: ['FEMA', 'Red Cross', 'Local Emergency Management', 'Insurance Company']
    };
  }

  generateSuppliesSection(type, householdSize, specialNeeds) {
    const baseSupplies = [
      'Water (1 gallon per person per day, 3-7 days supply)',
      'Non-perishable food (3-7 days supply)',
      'Manual can opener',
      'Flashlights and extra batteries',
      'Battery-powered or hand-crank radio',
      'First aid kit',
      'Whistle to signal for help',
      'Dust masks',
      'Plastic sheeting and duct tape',
      'Moist towelettes and garbage bags',
      'Wrench or pliers to turn off utilities',
      'Cell phone with chargers and backup battery',
      'Important documents (insurance, IDs) in waterproof container',
      'Cash (ATMs may not work)',
      'Emergency contact information',
      'Maps of local area',
      'Prescription medications (7-day supply)',
      'Extra glasses or contact lenses',
      'Pet supplies (if applicable)',
      'Change of clothes per person'
    ];

    const specialSupplies = {
      hurricane: [
        'Tarps for temporary roof repair',
        'Plywood for windows',
        'Sandbags',
        'Generator (if safe to use)',
        'Coolers for food storage'
      ],
      flood: [
        'Rubber boots',
        'Waterproof containers',
        'Sandbags',
        'Sump pump (if applicable)',
        'Water purification tablets'
      ],
      tornado: [
        'Hard hats',
        'Work gloves',
        'Sturdy shoes',
        'Emergency whistle',
        'Duct tape and plastic sheeting'
      ],
      earthquake: [
        'Fire extinguisher',
        'Gas shut-off wrench',
        'Crowbar',
        'Work gloves',
        'Hard hats'
      ],
      wildfire: [
        'N95 masks (for smoke)',
        'Goggles',
        'Fire-resistant clothing',
        'Wet towels',
        'Emergency radio'
      ]
    };

    const supplies = [
      ...baseSupplies.map(item => ({
        item,
        quantity: householdSize > 1 ? `For ${householdSize} people` : '1',
        checked: false
      })),
      ...(specialSupplies[type] || []).map(item => ({
        item,
        quantity: 'As needed',
        checked: false
      }))
    ];

    if (specialNeeds && specialNeeds.length > 0) {
      const needsSupplies = {
        'infants': ['Baby formula', 'Diapers', 'Baby wipes', 'Baby food', 'Bottles'],
        'elderly': ['Extra medications', 'Medical equipment batteries', 'Oxygen supplies', 'Walking aids'],
        'disabilities': ['Medical equipment', 'Extra medications', 'Service animal supplies', 'Communication devices'],
        'pets': ['Pet food (7 days)', 'Pet medications', 'Pet carriers', 'Pet ID tags', 'Leashes']
      };

      specialNeeds.forEach(need => {
        if (needsSupplies[need.toLowerCase()]) {
          needsSupplies[need.toLowerCase()].forEach(supply => {
            supplies.push({
              item: supply,
              quantity: 'As needed',
              checked: false
            });
          });
        }
      });
    }

    return {
      title: 'Emergency Supplies Checklist',
      priority: 'high',
      supplies,
      note: 'Adjust quantities based on your household size and specific needs'
    };
  }

  generateEvacuationSection(coordinates) {
    return {
      title: 'Evacuation Routes',
      priority: 'critical',
      coordinates: {
        lat: coordinates.lat,
        lon: coordinates.lon
      },
      note: 'Use GPS or maps to identify multiple evacuation routes from your location',
      tips: [
        'Plan at least 2 evacuation routes',
        'Identify local emergency shelters',
        'Plan for different disaster scenarios',
        'Practice evacuation with household members',
        'Keep vehicle fuel tank at least half full',
        'Know alternative routes in case primary route is blocked'
      ]
    };
  }

  generatePreDisasterChecklist(type, householdSize, specialNeeds) {
    return [
      { task: 'Prepare emergency kit', checked: false },
      { task: 'Review evacuation plan', checked: false },
      { task: 'Secure property', checked: false },
      { task: 'Charge all devices', checked: false },
      { task: 'Fill vehicle gas tank', checked: false },
      { task: 'Notify family of plans', checked: false },
      { task: 'Back up important documents', checked: false },
      { task: 'Stock up on medications', checked: false }
    ];
  }

  generatePlanId() {
    return `PLAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new PlanService();



