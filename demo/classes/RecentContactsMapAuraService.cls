public with sharing class RecentContactsMapAuraService {

	@AuraEnabled(cacheable=true)
	public static List<ViewModel> getRecentContacts() {
		Set<Id> contactIds = new Set<Id>();
		for(RecentlyViewed rv : [SELECT Id FROM RecentlyViewed WHERE Type = 'Contact']) {
			contactIds.add(rv.Id);
		}

		List<Contact> recentContacts = [
			SELECT Id,
				Name,
				FirstName,
				LastName,
				MailingCity,
				MailingLatitude,
				MailingLongitude
			FROM Contact
			WHERE Id IN :contactIds
				AND MailingCity != null
			LIMIT 5];

		List<ViewModel> vm = new List<ViewModel>();
		for(Contact con : recentContacts) {
			ViewModel m = new ViewModel();
			m.record = con;
			m.lat = String.valueOf(con.MailingLatitude);
			m.lng = String.valueOf(con.MailingLongitude);
			System.debug('lat: ' + con.MailingLatitude + ' lng: ' + con.MailingLongitude);
			vm.add(m);
		}

		return vm;
	}

	public class ViewModel {
		@AuraEnabled
		public Contact record {get;set;}
		@AuraEnabled
		public String lat {get;set;}
		@AuraEnabled
		public String lng {get;set;}
	}
}
