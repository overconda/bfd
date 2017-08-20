/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Vincenty Direct and Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2017  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong-vincenty.html                                           */
/* www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-vincenty.html                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';
if (typeof module!='undefined' && module.exports) var LatLon = require('./latlon-ellipsoidal.js'); // ≡ import LatLon from 'latlon-ellipsoidal.js'


/**
 * Direct and inverse solutions of geodesics on the ellipsoid using Vincenty formulae.
 *
 * From: T Vincenty, "Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of
 *       nested equations", Survey Review, vol XXIII no 176, 1975.
 *       www.ngs.noaa.gov/PUBS_LIB/inverse.pdf.
 *
 * @module  latlon-vincenty
 * @extends latlon-ellipsoidal
 */
/** @class LatLon */


/**
 * Returns the distance between ‘this’ point and destination point along a geodesic, using Vincenty
 * inverse solution.
 *
 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
 * ignored).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns (Number} Distance in metres between points or NaN if failed to converge.
 *
 * @example
 *   var p1 = new LatLon(50.06632, -5.71475);
 *   var p2 = new LatLon(58.64402, -3.07009);
 *   var d = p1.distanceTo(p2); // 969,954.166 m
 */
LatLon.prototype.distanceTo = function(point) {
    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

    try {
        return Number(this.inverse(point).distance.toFixed(3)); // round to 1mm precision
    } catch (e) {
        return NaN; // failed to converge
    }
};


/**
 * Returns the initial bearing (forward azimuth) to travel along a geodesic from ‘this’ point to the
 * specified point, using Vincenty inverse solution.
 *
 * Note: the datum used is of ‘this’ point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number}  initial Bearing in degrees from north (0°..360°) or NaN if failed to converge.
 *
 * @example
 *   var p1 = new LatLon(50.06632, -5.71475);
 *   var p2 = new LatLon(58.64402, -3.07009);
 *   var b1 = p1.initialBearingTo(p2); // 9.1419°
 */
LatLon.prototype.initialBearingTo = function(point) {
    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

    try {
        return Number(this.inverse(point).initialBearing.toFixed(9)); // round to 0.00001″ precision
    } catch (e) {
        return NaN; // failed to converge
    }
};


/**
 * Returns the final bearing (reverse azimuth) having travelled along a geodesic from ‘this’ point
 * to the specified point, using Vincenty inverse solution.
 *
 * Note: the datum used is of ‘this’ point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number}  Initial bearing in degrees from north (0°..360°) or NaN if failed to converge.
 *
 * @example
 *   var p1 = new LatLon(50.06632, -5.71475);
 *   var p2 = new LatLon(58.64402, -3.07009);
 *   var b2 = p1.finalBearingTo(p2); // 11.2972°
 */
LatLon.prototype.finalBearingTo = function(point) {
    if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');

    try {
        return Number(this.inverse(point).finalBearing.toFixed(9)); // round to 0.00001″ precision
    } catch (e) {
        return NaN; // failed to converge
    }
};


/**
 * Returns the destination point having travelled the given distance along a geodesic given by
 * initial bearing from ‘this’ point, using Vincenty direct solution.
 *
 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
 * ignored).
 *
 * @param   {number} distance - Distance travelled along the geodesic in metres.
 * @param   {number} initialBearing - Initial bearing in degrees from north.
 * @returns {LatLon} Destination point.
 *
 * @example
 *   var p1 = new LatLon(-37.95103, 144.42487);
 *   var p2 = p1.destinationPoint(54972.271, 306.86816); // 37.6528°S, 143.9265°E
 */
LatLon.prototype.destinationPoint = function(distance, initialBearing) {
    return this.direct(Number(distance), Number(initialBearing)).point;
};


/**
 * Returns the final bearing (reverse azimuth) having travelled along a geodesic given by initial
 * bearing for a given distance from ‘this’ point, using Vincenty direct solution.
 *
 * Note: the datum used is of ‘this’ point; distance is on the surface of the ellipsoid (height is
 * ignored).
 *
 * @param   {number} distance - Distance travelled along the geodesic in metres.
 * @param   {LatLon} initialBearing - Initial bearing in degrees from north.
 * @returns {number} Final bearing in degrees from north (0°..360°).
 *
 * @example
 *   var p1 = new LatLon(-37.95103, 144.42487);
 *   var b2 = p1.finalBearingOn(306.86816, 54972.271); // 307.1736°
 */
LatLon.prototype.finalBearingOn = function(distance, initialBearing) {
    return Number(this.direct(Number(distance), Number(initialBearing)).finalBearing.toFixed(9)); // round to 0.00001″ precision
};


/**
 * Vincenty direct calculation.
 *
 * @private
 * @param   {number} distance - Distance along bearing in metres.
 * @param   {number} initialBearing - Initial bearing in degrees from north.
 * @returns (Object} Object including point (destination point), finalBearing.
 * @throws  {Error}  If formula failed to converge.
 */
LatLon.prototype.direct = function(distance, initialBearing) {
    var _phi_1 = this.lat.toRadians(), _lambda_1 = this.lon.toRadians();
    var _aplha_1 = initialBearing.toRadians();
    var s = distance;

    var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

    var sin_aplha_1 = Math.sin(_aplha_1);
    var cos_aplha_1 = Math.cos(_aplha_1);

    var tanU1 = (1-f) * Math.tan(_phi_1), cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1 * cosU1;
    var _sigma_1 = Math.atan2(tanU1, cos_aplha_1);
    var sin_aplha_ = cosU1 * sin_aplha_1;
    var cosSq_aplha_ = 1 - sin_aplha_*sin_aplha_;
    var uSq = cosSq_aplha_ * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

    var cos2_sigma_M, sin_sigma_, cos_sigma_, _delta__sigma_;

    var _sigma_ = s / (b*A), _sigma__, iterations = 0;
    do {
        cos2_sigma_M = Math.cos(2*_sigma_1 + _sigma_);
        sin_sigma_ = Math.sin(_sigma_);
        cos_sigma_ = Math.cos(_sigma_);
        _delta__sigma_ = B*sin_sigma_*(cos2_sigma_M+B/4*(cos_sigma_*(-1+2*cos2_sigma_M*cos2_sigma_M)-
            B/6*cos2_sigma_M*(-3+4*sin_sigma_*sin_sigma_)*(-3+4*cos2_sigma_M*cos2_sigma_M)));
        _sigma__ = _sigma_;
        _sigma_ = s / (b*A) + _delta__sigma_;
    } while (Math.abs(_sigma_-_sigma__) > 1e-12 && ++iterations<100);
    if (iterations >= 100) throw new Error('Formula failed to converge'); // not possible!

    var x = sinU1*sin_sigma_ - cosU1*cos_sigma_*cos_aplha_1;
    var _phi_2 = Math.atan2(sinU1*cos_sigma_ + cosU1*sin_sigma_*cos_aplha_1, (1-f)*Math.sqrt(sin_aplha_*sin_aplha_ + x*x));
    var _lambda_ = Math.atan2(sin_sigma_*sin_aplha_1, cosU1*cos_sigma_ - sinU1*sin_sigma_*cos_aplha_1);
    var C = f/16*cosSq_aplha_*(4+f*(4-3*cosSq_aplha_));
    var L = _lambda_ - (1-C) * f * sin_aplha_ *
        (_sigma_ + C*sin_sigma_*(cos2_sigma_M+C*cos_sigma_*(-1+2*cos2_sigma_M*cos2_sigma_M)));
    var _lambda_2 = (_lambda_1+L+3*Math.PI)%(2*Math.PI) - Math.PI;  // normalise to -180..+180

    var _aplha_2 = Math.atan2(sin_aplha_, -x);
    _aplha_2 = (_aplha_2 + 2*Math.PI) % (2*Math.PI); // normalise to 0..360

    return {
        point:        new LatLon(_phi_2.toDegrees(), _lambda_2.toDegrees(), this.datum),
        finalBearing: _aplha_2.toDegrees(),
        iterations:   iterations,
    };
};


/**
 * Vincenty inverse calculation.
 *
 * @private
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {Object} Object including distance, initialBearing, finalBearing.
 * @throws  {Error}  If _lambda_ > π or formula failed to converge.
 */
LatLon.prototype.inverse = function(point) {
    var p1 = this, p2 = point;
    if (p1.lon == -180) p1.lon = 180;
    var _phi_1 = p1.lat.toRadians(), _lambda_1 = p1.lon.toRadians();
    var _phi_2 = p2.lat.toRadians(), _lambda_2 = p2.lon.toRadians();

    var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

    var L = _lambda_2 - _lambda_1;
    var tanU1 = (1-f) * Math.tan(_phi_1), cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1 * cosU1;
    var tanU2 = (1-f) * Math.tan(_phi_2), cosU2 = 1 / Math.sqrt((1 + tanU2*tanU2)), sinU2 = tanU2 * cosU2;

    var sin_lambda_, cos_lambda_, sinSq_sigma_, sin_sigma_=0, cos_sigma_=0, _sigma_=0, sin_aplha_, cosSq_aplha_=0, cos2_sigma_M=0, C;

    var _lambda_ = L, _lambda__, iterations = 0;
    do {
        sin_lambda_ = Math.sin(_lambda_);
        cos_lambda_ = Math.cos(_lambda_);
        sinSq_sigma_ = (cosU2*sin_lambda_) * (cosU2*sin_lambda_) + (cosU1*sinU2-sinU1*cosU2*cos_lambda_) * (cosU1*sinU2-sinU1*cosU2*cos_lambda_);
        if (sinSq_sigma_ == 0) break; // co-incident points
        sin_sigma_ = Math.sqrt(sinSq_sigma_);
        cos_sigma_ = sinU1*sinU2 + cosU1*cosU2*cos_lambda_;
        _sigma_ = Math.atan2(sin_sigma_, cos_sigma_);
        sin_aplha_ = cosU1 * cosU2 * sin_lambda_ / sin_sigma_;
        cosSq_aplha_ = 1 - sin_aplha_*sin_aplha_;
        cos2_sigma_M = (cosSq_aplha_ != 0) ? (cos_sigma_ - 2*sinU1*sinU2/cosSq_aplha_) : 0; // equatorial line: cosSq_aplha_=0 (§6)
        C = f/16*cosSq_aplha_*(4+f*(4-3*cosSq_aplha_));
        _lambda__ = _lambda_;
        _lambda_ = L + (1-C) * f * sin_aplha_ * (_sigma_ + C*sin_sigma_*(cos2_sigma_M+C*cos_sigma_*(-1+2*cos2_sigma_M*cos2_sigma_M)));
        if (Math.abs(_lambda_) > Math.PI) throw new Error('_lambda_ > π');
    } while (Math.abs(_lambda_-_lambda__) > 1e-12 && ++iterations<1000);
    if (iterations >= 1000) throw new Error('Formula failed to converge');

    var uSq = cosSq_aplha_ * (a*a - b*b) / (b*b);
    var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
    var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
    var _delta__sigma_ = B*sin_sigma_*(cos2_sigma_M+B/4*(cos_sigma_*(-1+2*cos2_sigma_M*cos2_sigma_M)-
        B/6*cos2_sigma_M*(-3+4*sin_sigma_*sin_sigma_)*(-3+4*cos2_sigma_M*cos2_sigma_M)));

    var s = b*A*(_sigma_-_delta__sigma_);

    var _aplha_1 = Math.atan2(cosU2*sin_lambda_,  cosU1*sinU2-sinU1*cosU2*cos_lambda_);
    var _aplha_2 = Math.atan2(cosU1*sin_lambda_, -sinU1*cosU2+cosU1*sinU2*cos_lambda_);

    _aplha_1 = (_aplha_1 + 2*Math.PI) % (2*Math.PI); // normalise to 0..360
    _aplha_2 = (_aplha_2 + 2*Math.PI) % (2*Math.PI); // normalise to 0..360

    return {
        distance:       s,
        initialBearing: s==0 ? NaN : _aplha_1.toDegrees(),
        finalBearing:   s==0 ? NaN : _aplha_2.toDegrees(),
        iterations:     iterations,
    };
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/** Extend Number object with method to convert numeric degrees to radians */
if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}

/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (Number.prototype.toDegrees === undefined) {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = LatLon; // ≡ export default LatLon
