import { JourneyReadinessProfile, PlaceToExplore, TripReadinessStatus } from '../types/inframap';

export interface ReadinessEvaluationResult {
  status: TripReadinessStatus;
  badgeLabel: string;
  summaryExplanation: string;
  reasons: string[];
}

export function evaluateTripReadiness(
  place: PlaceToExplore,
  journey?: JourneyReadinessProfile
): ReadinessEvaluationResult {
  if (!journey) {
    return {
      status: 'IMPORTANT_DETAILS_UNVERIFIED',
      badgeLabel: 'Important details unverified',
      summaryExplanation:
        'Essential transit connections and last-mile access arrangements from your selected origin have not yet been audited for this location.',
      reasons: [
        'Origin-to-destination transport corridor has not been verified.',
        'Last-mile transfer availability and return transport options are undocumented.'
      ]
    };
  }

  const reasons: string[] = [];
  let hasCriticalUnknowns = false;
  let hasModerateUnknowns = false;

  // Check primary rail/highway documentation
  if (!journey.primaryAccessCorridor.nearestRailHub.connectionVerified) {
    hasModerateUnknowns = true;
    reasons.push(journey.primaryAccessCorridor.nearestRailHub.note);
  }

  // Check Last-Mile Gap
  if (journey.lastMileGap.hasLastMileUncertainty) {
    hasModerateUnknowns = true;
    reasons.push(journey.lastMileGap.headline);
  }

  // Check if essential visitor logistics are missing
  if (place.visitorLogistics.openingHours.status === 'UNVERIFIED_CHECK_LOCALLY') {
    hasModerateUnknowns = true;
    reasons.push('Current opening hours require confirmation with local authorities before departure.');
  }

  if (place.visitorLogistics.permitsOrRestrictions.status === 'UNVERIFIED_CHECK_LOCALLY') {
    hasCriticalUnknowns = true;
    reasons.push('Permit or entry restriction requirements are unverified.');
  }

  if (journey.provenance.verificationTier === 'UNVERIFIED_RECORD') {
    hasCriticalUnknowns = true;
    reasons.push('Underlying transport access dataset is awaiting updated verification.');
  }

  if (hasCriticalUnknowns) {
    return {
      status: 'IMPORTANT_DETAILS_UNVERIFIED',
      badgeLabel: 'Important details unverified',
      summaryExplanation:
        'Essential information is missing, conflicting, or too old to support a confident assessment without independent verification.',
      reasons
    };
  }

  if (hasModerateUnknowns) {
    return {
      status: 'SOME_PLANNING_REQUIRED',
      badgeLabel: 'Some planning required',
      summaryExplanation:
        'Primary road or rail corridors are documented, but last-mile transfers, return transport, or current visitor timings require confirmation.',
      reasons
    };
  }

  return {
    status: 'WELL_DOCUMENTED',
    badgeLabel: 'Well documented',
    summaryExplanation:
      'The essential journey corridors, nearest transport hubs, and visitor entry parameters are supported by credible public sources.',
    reasons: [
      'Primary highway and transport hub proximity documented.',
      'Last-mile transfer expectations and visitor access guidelines recorded.'
    ]
  };
}
