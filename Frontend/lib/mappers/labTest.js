export function mapLabTestToFrontend(test) {
  if (!test) return null;

  return {
    id: test.id,
    name: test.name,
    lab: test.lab,
    labPartnerId: test.lab_partner_id || test.lab_partner?.id,
    category: test.category,
    testsIncluded: test.tests_included,
    collectionTime: test.collection_time,
    reportTime: test.report_time,
    price: test.price,
    popular: test.popular,
    homeCollection: test.home_collection,
    fastingRequired: test.fasting_required,
    preparation: test.preparation,
    description: test.description,
    discount: test.discount,
    labPartner: test.lab_partner,
  };
}

export function mapLabTestsToFrontend(tests = []) {
  return tests.map(mapLabTestToFrontend).filter(Boolean);
}

export function mapLabToFrontend(lab) {
  if (!lab) return null;
  return {
    id: lab.id,
    name: lab.name,
    address: lab.address,
    city: lab.city,
    phone: lab.phone,
    bio: lab.bio,
    rating: lab.rating,
    homeCollection: lab.home_collection,
    operatingHours: lab.operating_hours,
    collectionAreas: lab.collection_areas,
    testCount: lab.test_count ?? lab.lab_tests?.length ?? 0,
    minPrice: lab.min_price,
    tests: mapLabTestsToFrontend(lab.lab_tests || []),
  };
}

export function mapLabTestBookingToFrontend(booking) {
  return {
    id: booking.id,
    orderGroupId: booking.order_group_id,
    testId: booking.lab_test_id,
    testName: booking.lab_test?.name,
    lab: booking.lab_test?.lab || booking.lab_partner?.name,
    timeSlot: booking.time_slot,
    collectionDate: booking.collection_date,
    collectionType: booking.collection_type,
    price: booking.price,
    status: booking.status,
    paymentStatus: booking.payment_status,
    reportUrl: booking.report_url,
    prescriptionUrl: booking.prescription_url,
    patientName: booking.patient_name,
    collectorName: booking.collector_name,
    address: booking.collection_address,
    raw: booking,
  };
}
