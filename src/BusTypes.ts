import { Moment, Duration, Direction } from './CommonTypes'

export type BusArrival = {
  adherence: Duration
  blockId: string
  blockAbbriviation: string
  direction: Direction
  latitude: number
  longitude: number
  eventTime: Moment
  route: BusRoute
  stopId: string
  timepoint: string
  tripId: string
  busId: string
}

// https://itsmarta.com/bus-routes.aspx
export type BusRoute =
  | '1'   // Marietta Blvd/Joseph E Lowery Blvd
  | '2'   // Ponce de Leon Avenue / Druid Hills
  | '3'   // Martin Luther King Jr Dr/Auburn Ave
  | '4'   // Moreland Avenue
  | '5'   // Piedmont Road / Sandy Springs
  | '6'   // Clifton Road / Emory
  | '8'   // North Druid Hills Road
  | '9'   // Boulevard / Tilson Road
  | '12'  // Howell Mill Road / Cumberland
  | '14'  // 14th Street / Blandtown
  | '15'  // Candler Road
  | '19'  // Clairmont Road / Howard Avenue
  | '21'  // Memorial Drive
  | '24'  // McAfee / Hosea Williams
  | '25'  // Peachtree Boulevard
  | '26'  // Marietta Street / Perry Boulevard
  | '27'  // Cheshire Bridge Road
  | '30'  // LaVista Road
  | '32'  // Bouldercrest
  | '34'  // Gresham Road
  | '36'  // N Decatur Road / Virginia Highland
  | '37'  // Defoors Ferry Road
  | '39'  // Buford Highway
  | '40'  // Peachtree Street / Downtown
  | '42'  // Pryor Road
  | '47'  // I-85 Access Road
  | '49'  // McDonough Boulevard
  | '50'  // Donald Lee Hollowell Parkway
  | '51'  // Joseph E Boone Boulevard
  | '55'  // Jonesboro Road
  | '58'  // Hollywood Road / Lucile Avenue
  | '60'  // Hightower Road
  | '66'  // Lynhurst Drive / Princeton Lakes
  | '68'  // Benjamin E Mays Drive
  | '71'  // Cascade Road
  | '73'  // Fulton Industrial
  | '74'  // Flat Shoals Road
  | '75'  // Lawrenceville Highway
  | '78'  // Cleveland Avenue
  | '79'  // Sylvan Hills
  | '81'  // Venetian Hills / Delowe Drive
  | '82'  // Camp Creek / South Fulton Parkway
  | '83'  // Campbellton Road
  | '84'  // Washington Rd/Camp Crk Marketplace
  | '85'  // Roswell
  | '86'  // Fairington Road
  | '87'  // Roswell Road / Sandy Springs
  | '89'  // Old National Highway
  | '93'  // Headland Drive / Main Street
  | '94'  // Northside Drive
  | '95'  // Metropolitan Parkway
  | '102' // North Avenue / Little Five Points
  | '103' // Peeler Road
  | '104' // Winters Chapel Road
  | '107' // Glenwood
  | '110' // Peachtree Road / Buckhead
  | '111' // Snapfinger Woods
  | '114' // Columbia Drive
  | '115' // Covington Highway
  | '116' // Redan Road
  | '117' // Rockbridge Road / Panola Road
  | '119' // Hairston Road / Stone Mtn Village
  | '120' // East Ponce De Leon Avenue
  | '121' // Memorial Drive / N Hairston Road
  | '123' // Church Street
  | '124' // Pleasantdale Road
  | '125' // Clarkston
  | '126' // Chamblee-Tucker Road
  | '132' // Tilly Mill Road
  | '133' // Shallowford Road
  | '140' // North Point Parkway
  | '141' // Haynes Bridge Road / Milton
  | '142' // East Holcomb Bridge Road
  | '143' // Windward Park & Ride
  | '148' // Mount Vernon Highway
  | '150' // Dunwoody Village
  | '153' // James Jackson Parkway
  | '155' // Pittsburgh
  | '162' // Myrtle Drive / Alison Court
  | '165' // Fairburn Road
  | '172' // Sylvan Road / Virginia Avenue
  | '178' // Empire Blvd / Southside Ind Park
  | '180' // Roosevelt Highway
  | '181' // Washington Road / Fairburn
  | '183' // Barge Road P&R / Lakewood
  | '185' // Alpharetta
  | '186' // Rainbow Drive / South DeKalb
  | '189' // Flat Shoals Road / Scofield Road
  | '191' // Riverdale / ATL Intl Terminal
  | '192' // Old Dixie / Tara Boulevard
  | '193' // Morrow / Jonesboro
  | '194' // Conley Road / Mt Zion
  | '195' // Forest Parkway
  | '196' // Upper Riverdale / Southlake
  | '201' // Six Flags Over Georgia
  | '221' // Memorial Drive Limited
  | '295' // Metropolitan Campus Express
  | '800' // Lovejoy
  | '809' // Monroe Drive / Boulevard
  | '813' // Atlanta University Center
  | '816' // North Highland Avenue
  | '823' // Belvedere
  | '825' // Johnson Ferry Road
  | '832' // Grant Park
  | '850' // Carroll Heights / Fairburn Heights
  | '853' // Center Hill
  | '856' // Baker Hills / Wilson Mill Meadows
  | '865' // Boulder Park Drive
  | '867' // Peyton Forest / Dixie Hills
  | '899' // Old Fourth Ward
