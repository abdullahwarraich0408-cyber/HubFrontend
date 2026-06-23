export function mapLabTestToFrontend(test) {
  if (!test) return null;

  return {
    id: test.id,
    name: test.name,
    lab: test.lab,
    category: test.category,
    testsIncluded: test.tests_included,
    collectionTime: test.collection_time,
    reportTime: test.report_time,
    price: test.price,
    popular: test.popular,
    homeCollection: test.home_collection,
    description: test.description,
    discount: test.discount,
  };
}

export function mapLabTestsToFrontend(tests = []) {
  return tests.map(mapLabTestToFrontend).filter(Boolean);
}

export function mapLabTestBookingToFrontend(booking) {
  return {
    id: booking.id,
    testId: booking.lab_test_id,
    testName: booking.lab_test?.name,
    lab: booking.lab_test?.lab,
    timeSlot: booking.time_slot,
    collectionDate: new Date(booking.collection_date).toLocaleDateString(),
    price: booking.price,
    status: booking.status,
    address: booking.collection_address,
  };
}
