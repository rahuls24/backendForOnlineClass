const express = require('express');
const router = express.Router();
const Course = require('../../Models/courses');
const User = require('../../Models/users');
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

/*

    @ Route Type => Post
    @ Route Address => '/api/courses/buy-course'
    @ Route Access => Private
	@ Description => Responsible for buying course by Student

*/
router.post(
	'/buy-course',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		if (req.user.role !== 'student') {
			return res.json({
				isSuccess: false,
				errorMsg: 'Course can brought only by Student',
			});
		}
		Course.findOne({ name: req.body.name, addedBy: req.body.addedBy })
			.then((course) => {
				if (!course) {
					return res.json({
						isSuccess: false,
						errorMsg: 'Course is not present in the DB',
					});
				}
				User.findById(req.user._id)
					.then((user) => {
						const coursesBrought = user.courses;
						if (coursesBrought.includes(course._id)) {
							return res.json({
								isSuccess: false,
								errorMsg: 'Course already brought by Student',
							});
						}
						user.courses.push(course._id);
						course.enrolledBy += 1;
						course.save();
						user
							.save()
							.then((updatedUser) => {
								return res.json({
									isSuccess: true,
									user: updatedUser,
								});
							})
							.catch((err) => console.log(err));
					})
					.catch((err) =>
						console.log(
							'Error occurred while checking the User is present . Route = /api/courses/buy-course Method POST',
							err,
						),
					);
			})
			.catch((err) =>
				console.log(
					'Error occurred while checking the course is already present of not. Route = /api/courses/buy-course Method POST',
					err,
				),
			);
	},
);

module.exports = router;
