const express = require('express');
const router = express.Router();
const Course = require('../../Models/courses');
const passport = require('passport');

/*

    @ Route Type => Post
    @ Route Address => '/api/courses/add-course'
    @ Route Access => Private
	@ Description => Responsible for adding course by instructor

*/
router.post(
	'/add-course',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		if (req.user.role !== 'instructor') {
			return res.json({
				isSuccess: false,
				errorMsg: 'Only instructor can add a course',
			});
		}
		Course.findOne({ name: req.body.name, addedBy: req.user._id })
			.then((isCoursePresent) => {
				if (isCoursePresent) {
					return res.json({
						isSuccess: false,
						errorMsg: 'Course already present',
					});
				}
				const newCourse = new Course({
					name: req.body.name,
					addedBy: req.user._id,
				});
				if (req.body.category) {
					newCourse.category = req.body.category;
				}
				newCourse
					.save()
					.then((course) => {
						return res.json({
							isSuccess: true,
							course: course,
						});
					})
					.catch((err) =>
						console.log(
							'Error occurred while saving the course is DB. Route = /api/courses/add-course Method POST',
							err,
						),
					);
			})
			.catch((err) =>
				console.log(
					'Error occurred while checking the course is already present of not. Route = /api/courses/add-course Method POST',
					err,
				),
			);
	},
);

module.exports = router;
