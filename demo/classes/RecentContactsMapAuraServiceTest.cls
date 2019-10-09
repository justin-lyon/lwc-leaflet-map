@isTest
private class RecentContactsMapAuraServiceTest {
	@TestSetup
	static void setupContacts(){
		List<Contact> contacts = new List<Contact>();
		contacts.add(new Contact(
			FirstName = 'Joe',
			LastName = 'Contact1',
			MailingCity = 'Dallas'));
		contacts.add(new Contact(
			FirstName = 'Joe',
			LastName = 'Contact2',
			MailingCity = 'Dallas'));
		contacts.add(new Contact(
			FirstName = 'Joe',
			LastName = 'Contact3',
			MailingCity = 'Dallas'));
		contacts.add(new Contact(
			FirstName = 'Joe',
			LastName = 'Contact4',
			MailingCity = 'Dallas'));
		contacts.add(new Contact(
			FirstName = 'Joe',
			LastName = 'Contact5',
			MailingCity = 'Dallas'));
		contacts.add(new Contact(
			FirstName = 'Joe',
			LastName = 'Contact6',
			MailingCity = 'Dallas'));

		insert contacts;
	}

	static TestMethod void getRecentContacts_givenDefault_shouldGet5Contacts() {
		Test.startTest();

			List<RecentContactsMapAuraService.ViewModel> contacts = RecentContactsMapAuraService.getRecentContacts();

		Test.stopTest();

		System.assertEquals(5, contacts.size());
	}
}
