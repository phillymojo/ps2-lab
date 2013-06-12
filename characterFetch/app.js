/**App Launcher*/

//Create a top level global object to store our models/veiws/configs/etc.
appSettings = {models: {}, views: {}, dataManipulators: {}};
appSettings.char_id = '5428013610387904065';
appSettings.censusURL = 'https://census.soe.com/get/';
appSettings.censusGame = 'ps2';


//Define the charModel
appSettings.models.CharacterModel = Backbone.Model.extend({
	initialize: function(){
		// this.resolves = '?c:resolve=friends,stat,stat_history,weapon_stat,item_full(type),world,outfit(alias,id,name),online_status&c:internal=true';
		// this.resolves = '?c:internal=true'
	},

	url: function(){
		return appSettings.censusURL 
		+ appSettings.censusGame + '/'
		+ 'single_character_by_id/?id='
		+ appSettings.char_id 
	},
	sync: function(method, model, options){
		var params = _.extend({
			type: 'GET',
			dataType: 'jsonp',
			url: model.url(),
			processData: false,
			cache: true
		}, options)

		return Backbone.sync(method, model, params);
	},
	parse: function(response){
		var rawchardata = response.single_character_by_id_list[0];
		
		console.log(rawchardata);
		console.log(appSettings.dataManipulators.vehicleStats(rawchardata.weapon_stats));
		console.log(appSettings.dataManipulators.itemStats(rawchardata.weapon_stats));
		console.log(appSettings.dataManipulators.characterStats(rawchardata.stats));

		return rawchardata;
	}
});


appSettings.dataManipulators.vehicleStats = function(weaponStats){
	/**
	This data manipulator is expecting to get an unfiltered list of item stats(character_list[0].weapon_stats) via the c:resolve=weapon_stat paramater on the charcter data URL request
	It converts the raw list of stats into indexed lists for both vehicles
	*/		

	/**Create a list of items and their stats by group*/
	var groupedItemsList = _.groupBy(weaponStats, 'item_id');
	//At this point we have an indexed list of all the item ids; the '0' object is the list of vehicles' stats


	/**Create a master list of the Vehicle Stats (no weapons involved) */
	var masterVehicleStatsByID = {};
	var vehicleprefix = 'v_';
	var groupedVehiclesList = _.groupBy(groupedItemsList[0], 'vehicle_id');
	_.each(groupedVehiclesList, function(vehicle, key, list){
		masterVehicleStatsByID[vehicleprefix+key] = {'id': key};
		_.each(vehicle, function(stat){
			masterVehicleStatsByID[vehicleprefix+key][stat.stat_name] = {'value': stat.value, 'last_save': stat.last_save};
		});
	});
	//add the vehicle name if it exists in appSettings.vehicleTable
	if(appSettings.vehicleTable) {
		_.each(masterVehicleStatsByID, function(vehicleRecord){
			if(appSettings.vehicleTable[vehicleRecord.id])	vehicleRecord['name'] = appSettings.vehicleTable[vehicleRecord.id].name.en;
		});
	}

	return masterVehicleStatsByID;

};

appSettings.dataManipulators.itemStats = function(weaponStats){
	/**
	This data manipulator is expecting to get an unfiltered list of item stats(character_list[0].weapon_stats) via the c:resolve=weapon_stat paramater on the charcter data URL request
	It converts the raw list of stats into indexed lists for items
	*/

	/**Create a list of items and their stats by group*/
	var groupedItemsList = _.groupBy(weaponStats, 'item_id');
	//At this point we have an indexed list of all the item ids; the '0' object is the list of vehicles' stats
	
	/**Create the master list of items, with the vehicles removed*/
	var masterItemStatsByID = {};
	var weaponprefix = 'i_';
	delete groupedItemsList[0]; //remove the vehicle stats; not needed for itemslist

	_.each(groupedItemsList, function(item, key, list){
		masterItemStatsByID[weaponprefix+key] = {'id': key};
		_.each(item, function(stat){
			masterItemStatsByID[weaponprefix+key][stat.stat_name] = {'value': stat.value, 'last_save': stat.last_save};
		});
	});
	//add the item name if it exists in appSettings.itemsTable
	if(appSettings.itemsTable) {
		_.each(masterItemStatsByID, function(itemRecord){
			if(appSettings.itemsTable['item_'+itemRecord.id]) itemRecord['name'] = appSettings.itemsTable['item_'+itemRecord.id].name.en;
		});
	}
	return masterItemStatsByID;

};

appSettings.dataManipulators.characterStats = function(charStats){
	var groupedProfileList = _.groupBy(charStats, 'profile_id');

	var masterCharStatsByProfile = {};
	var profileprefix = 'p_';

	_.each(groupedProfileList, function(profile, key, list){
		masterCharStatsByProfile[profileprefix+key] = {'id': key};
		_.each(profile, function(stat){
			masterCharStatsByProfile[profileprefix+key][stat.stat_name] = stat;
		});
	});
	
	return masterCharStatsByProfile;
};


//Define the CharView
appSettings.views.CharView = Backbone.View.extend({
	attributes: {
		'class': 'character'
	},
	initialize: function(options){
		this.template = _.template($('#tpl-character').html());
	},
	render: function(){
		var $this = this.$el;
		$this.html(this.template(this.model.toJSON()));
		return $this;
	}
});

//Start up a Backbone model to grab the data
appSettings.charModel = new appSettings.models.CharacterModel();

$(function(){
	//DOM Ready
	console.log('app started')

	appSettings.charModel.fetch({
		success: function(){

			//Pass the model to the View
			appSettings.charView = new appSettings.views.CharView({model: appSettings.charModel});
			$('#main-container').html(appSettings.charView.render());
		},
	});	
});

