/// <reference path="angular.js" />

'use strict';
var app = angular
				.module("myApp", ['ui.bootstrap'])

				.controller("LoginCntrl", function ($scope, $http, $window) {

					////// Login Page  controller

					$scope.Login = function () {
						sessionStorage.setItem("AppID", undefined);
						sessionStorage.setItem("IsUpdate", undefined);
						sessionStorage.setItem("Subject", undefined);

						if ($scope.AppId == '' || $scope.AppId == undefined || $scope.LoginDOB == '' || $scope.LoginDOB == undefined) {
							swal("Incorrect Application ID / DOB ");
						}
						else {
							var AppId = $scope.AppId;
							var dob = $scope.LoginDOB;
							var req = {
								method: 'POST',
								url: "BasicServices.asmx/getLogin",
								data: { ApplicationId: AppId, DOB: dob }
							}
							$http(req).then(function (response) {
								if (response.data.d.length > 0) {
									//console.log(response.data.d);

									if (response.data.d[0].DOI.length >0 && (response.data.d[0].status != '')) {
										swal("You have already appeared for interview");
									}
									else {
										sessionStorage.setItem("AppID", response.data.d[0].ApplicationId);
										sessionStorage.setItem("IsUpdate", "Yes");  
										$scope.AppId = "";
										$scope.LoginDOB = "";
										$window.location.href = '/RegistrationPage.html';
									}
								}
								else {
									swal("Incorrect Application ID / DOB ");
								}
							});
						}
					}


					// forget Application ID
					$scope.ForgetId = function () {
						var nm = $scope.AppSearchName;
						var db = $scope.AppSearchDOB;
						var ml = $scope.AppSearchMail;
						var ph = $scope.AppSearchPhone;
						$scope.SearchedAppID = "";
					}

					$scope.SearchAppID = function () {
						var nm = $scope.AppSearchName;
						var db = $scope.AppSearchDOB;
						var ml = $scope.AppSearchMail;
						var ph = $scope.AppSearchPhone;

						if (nm == '' || nm == undefined || db == '' || db == undefined || ml == '' || ml == undefined || ph == '' || ph == undefined) {
							swal("Please Fill All Detail");
							$scope.SearchedAppID = "";
						}
						else {
							var req = {
								method: 'POST',
								url: "BasicServices.asmx/SearchAppID",
								data: { name: nm, dob: db, email: ml, mblno: ph }
							}
							$http(req).then(function (response) {
								if (response.data.d.length > 0) {
									var msg = "Your Application ID is : " + response.data.d[0].AppID;
									$scope.SearchedAppID = msg;
									$scope.AppSearchName = "";
									$scope.AppSearchDOB = "";
									$scope.AppSearchMail = "";
									$scope.AppSearchPhone = "";

								}
								else {
									swal("No Record Found");
									$scope.SearchedAppID = "";
								}
							});
						}
					}

					$scope.NewUser = function () {
						sessionStorage.setItem("AppID", undefined);
						sessionStorage.setItem("IsUpdate", undefined);
						sessionStorage.setItem("Subject", undefined);
						$window.location.href = '/RegistrationPage.html';
					}

				})

				.controller("RegCntrl", function ($scope, $http, $window, $timeout) {

						$http.get('BasicServices.asmx/GetAllBasicDataFunction')
						.then(function (response) {
							$scope.appointments = response.data.AppointmentCategoryList;
							$scope.subjects = response.data.MySubjectList;
							$scope.Cities = response.data.MyCityList;
							$scope.Responds = response.data.MdRefrence;
							$scope.Degrees = response.data.MyDegree;
							$scope.PgDegrees = response.data.MyPgDegree;
						});

						$scope.getPost = function (Posttype) {
							var req = {
								method: 'POST',
								url: "BasicServices.asmx/GetPost",
								//responseType:'json',  //optional
								headers: {
									'Content-Type': 'application/json'
								}, data: { type: Posttype }
							}
							$http(req).then(function (response) {
								//console.log(response);
								$scope.posts = response.data.d;
							});
						}

						$scope.ArchiAndPahrmaCheck = function (subject) {
							var req = {
								method: 'POST',
								url: "BasicServices.asmx/GetArchiAndPharmaCheck",                               
								headers: {
									'Content-Type': 'application/json'
								}, data: { sub: subject }
							}

							$http(req).then(function (response) {                                
								var RegName = response.data.d[0].RegNo;
								if (RegName == undefined || RegName == '') {
									$scope.RegistartionNumberVisible = false;
								}
								else
								{
									$scope.RegistrationNumberText = 'Enter Your ' + RegName + ' Registration Number(If you have)';
									$scope.RegistartionNumberVisible = true;
								}
								
							});
						}

						$scope.getDistrictStateCountry = function (city) {
							if (city != 'Other') {
								var req = {
									method: 'POST',
									url: "BasicServices.asmx/getDistrictStateCountry",
									data: { City: city }
								}
								$http(req).then(function (response) {
									//console.log(response.data.d);
									$scope.District = response.data.d[0].District;
									$scope.State = response.data.d[0].State;
									$scope.Country = response.data.d[0].Country;
								});
							}
							else {
								$scope.District = "";
								$scope.State = "";
								$scope.Country = "";
							}
						}

						$scope.Titles = [{ Title: 'Mr' }, { Title: 'Ms' }, { Title: 'Mrs' }, { Title: 'Dr' }];

						$scope.Categorys = [{ Category: 'General' }, { Category: 'SC/ST' }, { Category: 'OBC' }, { Category: 'PH' }];

						$scope.National = [{ Nation: 'NRI' }, { Nation: 'Indian' }];

						$scope.ExamType = [{ Type: "Matric" }, { Type: "10+2" }, { Type: "Diploma" }, { Type: "Graduation" }, { Type: "P.G." },
											{ Type: "M.Phil" }, { Type: "Ph.D" }, { Type: "Any Other Exam" }, { Type: "Lecturer Eligibility Test" }];
						//$scope.ExperienceDetail = [{University:'',Designation:'',StartDate:'',EndDate:'',Salary:'',Reason:''}];
						$scope.ExperienceDetail = [];

						$scope.EducationDetail = [];
						// Examtype Change 

						$scope.ExamTypeChange = function (type) {
							if (type == 'Matric') {
								$scope.DegreeName = 'General';
							}
							else if (type == '10+2') {
								$scope.DegreeName = '10+2';
							}
							else if (type == 'Diploma') {
								$scope.DegreeName = 'Diploma';
							}
							else if (type == 'M.Phil') {
								$scope.DegreeName = 'M.Phil';
							}
							else if (type == 'Ph.D') {
								$scope.DegreeName = 'Ph.D';
							}
							else if (type == 'Lecturer Eligibility Test') {
								$scope.DegreeName = 'UGC-NET';
							}
							else if (type == 'Any Other Exam') {
								$scope.DegreeName = '';
							}
							$scope.OtherDegree = "";
						}

						//  add Education detail in table 

						$scope.AddEd = function () {


							if ($scope.AllExamType == undefined) {
								swal("Please Select Exam Type");
								return;
							}
							else {

								// Graduation Check
								if ($scope.AllExamType.Type == 'Graduation') {
									if ($scope.GraduationDegree == undefined) {
										swal("Pelease Select Graduation Degree");
										return;
									}
									else {
										if ($scope.GraduationDegree == 'Other') {
											if ($scope.OtherDegree == undefined || $scope.OtherDegree == '') {
												swal("Please Fill Other Graduation Degree");
												return;
											}
											else { }
										}
									}
								}

								// PG check
								if ($scope.AllExamType == 'P.G.') {
									if ($scope.PgDegree == undefined) {
										swal("Please Select P.G. Degree");
										return;
									}
									else {
										if ($scope.PgDegree == 'Other') {
											if ($scope.OtherDegree == undefined || $scope.OtherDegree == '') {
												swal("Please Fill Other P.G.");
												return;
											}
											else {
											}
										}
									}
								}

								if ($scope.EdSubject == undefined) {
									swal("Please Fill Subject");
									return;
								}
								if ($scope.EdUni == undefined) {
									swal("Please Fill University / Board");
									return;
								}
								if ($scope.EdCollege == undefined) {
									swal("Please Fill Institue / College");
									return;
								}
								if ($scope.EdStatus == undefined) {
									swal("Please Select Status");
									return;
								}
								if ($scope.EdYear == undefined || $scope.EdYear <= 1960)  {
									swal("Please Select Year Of Passing");
									return;
								}
								if ($scope.EdDurationYear == undefined) {
									swal("Please Select Duration Of Course (Years)");
									return;
								}
								if ($scope.EdDurationMonths == undefined) {
									swal("Please Select Duration Of Course (Months)");
									return;
								}
								if ($scope.EdMarks == undefined) {
									swal("Please Fill Marks / CGPA / GPA");
									return;
								}
								if ($scope.EdMode == undefined) {
									swal("Please Select Mode Of Education");
									return;
								}
								if ($scope.EdMarks > 100) {
									swal("Please Fill valid Marks / CGPA / GPA")
									return;
								}

								else {
									$scope.EducationAddedTable = true;
									var ed = {};
									ed.EducationExam = $scope.AllExamType;

									if (ed.EducationExam == 'Graduation') {
										if ($scope.GraduationDegree == 'Other') {
											ed.EducationdDegree = $scope.OtherDegree;
										}
										else {
											ed.EducationdDegree = $scope.GraduationDegree;
										}
									}

									else if (ed.EducationExam == 'P.G.') {
										if ($scope.PgDegree == 'Other') {
											ed.EducationdDegree = $scope.OtherDegree;
										}
										else {
											ed.EducationdDegree = $scope.PgDegree;
										}
									}
									else if (ed.EducationExam != 'Graduation' && ed.EducationExam != 'P.G.') {
										ed.EducationdDegree = $scope.DegreeName;
									}

									ed.EducationdSubject = $scope.EdSubject;
									ed.EducationdUni = $scope.EdUni;
									ed.EducationdCollege = $scope.EdCollege;
									ed.EducationStatus = $scope.EdStatus;
									ed.EducationYOP = $scope.EdYear;
									ed.EducationDOCY = $scope.EdDurationYear;
									ed.EducationDOCM = $scope.EdDurationMonths;
									ed.EducationMarks = $scope.EdMarks;
									ed.EducationMode = $scope.EdMode;

									var check = 0;
									if ($scope.EducationDetail.length == 0) {
										if (ed.EducationExam != 'Matric') {
											swal("Please Add Matric Detail First");
											$scope.EducationAddedTable = false;
											return;
										}
									}
									else {
										for (var i = 0; i < $scope.EducationDetail.length; i++) {
											if ($scope.EducationDetail[i].EducationExam == ed.EducationExam) {
												swal("Already Added!", "Please Select Another Qualifcation", "warning");
												return;
											}

											if (ed.EducationExam == 'Lecturer Eligibility Test') {
												if ($scope.EducationDetail[i].EducationExam == 'Graduation') {
													check = check + 1;
												}
											}
											if (ed.EducationExam == 'Ph.D' || ed.EducationExam == 'M.Phil') {
												if ($scope.EducationDetail[i].EducationExam == 'P.G.') {
													check = check + 1;
												}
											}
											if (ed.EducationExam == 'P.G.') {
												if ($scope.EducationDetail[i].EducationExam == 'Graduation') {
													check = check + 1;
												}
											}
											if (ed.EducationExam == 'Graduation') {
												if ($scope.EducationDetail[i].EducationExam == 'Diploma' || $scope.EducationDetail[i].EducationExam == '10+2') {
													check = check + 1;
												}
											}
											if (ed.EducationExam == 'Diploma' || ed.EducationExam == '10+2') {
												if ($scope.EducationDetail[i].EducationExam == 'Matric') {
													check = check + 1;
												}
											}
										}

										if (check == 0) {
											swal("You Missed Something!", "Fill your education detail in chronological order", "warning");
											return;
										}
									}

									$scope.EducationDetail.push(ed);


									$scope.AllExamType = undefined;
									$scope.DegreeName = "";
									$scope.GraduationDegree = undefined;
									$scope.OtherDegree = "";
									$scope.PgDegree = undefined;
									$scope.EdSubject = "";
									$scope.EdUni = "";
									$scope.EdCollege = "";
									$scope.EdStatus = "";
									$scope.EdYear = "";
									$scope.EdDurationYear = undefined;
									$scope.EdDurationMonths = undefined;
									$scope.EdMarks = "";
									$scope.EdMode = "";
								}
							}


						}

						// remove education detail from table

						$scope.RemoveEd = function (index) {
							var exm = $scope.EducationDetail[index].EducationExam;

							if ($window.confirm("Do you want to remove : " + exm)) {
								$scope.EducationDetail.splice(index, 1);
							}
							var exp = $scope.EducationDetail.length;
							if (exp == 0) {
								$scope.EducationAddedTable = false;
							}

						}

						// add experince in table
						$scope.AddExperience = function () {

							if ($scope.ExpUniName == '' || $scope.ExpUniName == undefined) {
								swal("Please Fill Institiue / Universit / Company name", "", "warning");
							}
							else if ($scope.ExpDesignation == '' || $scope.ExpDesignation == undefined) {
								swal("Please Fill Designation", "", "warning");
							}
							else if ($scope.ExpStartDate == '' || $scope.ExpStartDate == undefined) {
								swal("Please Fill Start Date", "", "warning");
							}
							else if ($scope.ExpEndDate == '' || $scope.ExpEndDate == undefined) {
								swal("Please Fill End Date", "", "warning");
							}
							else if ($scope.ExpSalary == '' || $scope.ExpSalary == undefined) {
								swal("Please Fill Salary", "", "warning");
							}
							else if ($scope.ExpLeaveReason == '' || $scope.ExpLeaveReason == undefined) {
								swal("Please Fill Reason of Leaving", "", "warning");
							}
							else {

								var d2 = $scope.ExpEndDate.split('/');
								var d1 = $scope.ExpStartDate.split('/');

								var dt2 = d2[2] + '/' + d2[1] + '/' + d2[0]; // year/month/day format
								var dt1 = d1[2] + '/' + d1[1] + '/' + d1[0];
								
								var date2 = new Date(dt2);
								var date1 = new Date(dt1);
								var timeDiff = (date2.getTime() - date1.getTime());
								var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

								if (dayDifference < 1) {
									swal("Please Select Valid Start/End Date");
									return;
								}

								$scope.ExperienceAddedTable = true;
								var exp = {};
								exp.University = $scope.ExpUniName;
								exp.Designation = $scope.ExpDesignation;
								exp.StartDate = $scope.ExpStartDate;
								exp.EndDate = $scope.ExpEndDate;
								exp.Salary = $scope.ExpSalary;
								exp.Reason = $scope.ExpLeaveReason;

								$scope.ExperienceDetail.push(exp);

								$scope.ExpUniName = "";
								$scope.ExpDesignation = "";
								$scope.ExpStartDate = "";
								$scope.ExpEndDate = "";
								$scope.ExpSalary = "";
								$scope.ExpLeaveReason = "";
							}
						}

						// remove experince from table
						$scope.RemoveExp = function (index) {
							var uni = $scope.ExperienceDetail[index].University;

							//swal({
							//    title: "Are you sure?",
							//    text: "You can add another after delete it.",
							//    type: "warning",
							//    showCancelButton: true,
							//    confirmButtonClass: "btn-danger",
							//    confirmButtonText: "Yes, delete it!",
							//    closeOnConfirm: false
							//},
							//function () {
							//    swal("Deleted", "Deleted Successfully!!!", "success");
							//    $scope.testing();
							//});


							if ($window.confirm("Do you want to remove : " + uni)) {
								$scope.ExperienceDetail.splice(index, 1);
							}
							var exp = $scope.ExperienceDetail.length;
							if (exp == 0) {
								$scope.ExperienceAddedTable = false;
							}

						}

						$scope.CourseDurationYear = [{ Years: '0' }, { Years: '1' }, { Years: '2' }, { Years: '3' }, { Years: '4' }, { Years: '5' }, { Years: '6' },
													 { Years: '7' }, { Years: '8' }, { Years: '9' }, { Years: '10' }];

						$scope.CourseDurationMonths = [{ Months: '0' }, { Months: '1' }, { Months: '2' }, { Months: '3' }, { Months: '4' }, { Months: '5' }, { Months: '6' },
													 { Months: '7' }, { Months: '8' }, { Months: '9' }, { Months: '10' }, { Months: '11' }];


						$scope.ExpYears = [{ Experience: '0' }, { Experience: '1' }, { Experience: '2' }, { Experience: '3' }, { Experience: '4' }, { Experience: '5' }, { Experience: '6' }, { Experience: '7' }, { Experience: '8' }, { Experience: '9' }, { Experience: '10' },
										 { Experience: '11' }, { Experience: '12' }, { Experience: '13' }, { Experience: '14' }, { Experience: '15' }, { Experience: '16' }, { Experience: '17' }, { Experience: '18' }, { Experience: '19' }, { Experience: '20' },
										 { Experience: '21' }, { Experience: '22' }, { Experience: '23' }, { Experience: '24' }, { Experience: '25' }, { Experience: '26' }, { Experience: '27' }, { Experience: '28' }, { Experience: '29' }, { Experience: '30' },
										 { Experience: '31' }, { Experience: '32' }, { Experience: '33' }, { Experience: '34' }, { Experience: '35' }, { Experience: '36' }, { Experience: '37' }, { Experience: '38' }, { Experience: '39' }, { Experience: '40' }
						];

						$scope.ExpMonths = [{ Experience: '0' }, { Experience: '1' }, { Experience: '2' }, { Experience: '3' }, { Experience: '4' }, { Experience: '5' }, { Experience: '6' }, { Experience: '7' }, { Experience: '8' }, { Experience: '9' }, { Experience: '10' }, { Experience: '11' }];

						$scope.xEmpChange = function () {
							$scope.xUID = undefined;
							$scope.xDept = undefined;
							$scope.xStartDate = undefined;
							$scope.xEndDate = undefined;
						}
						
						$scope.AlumniChange = function () {
							$scope.RegNo = undefined;
							$scope.Program = undefined;
							$scope.AlumniStartDate = undefined;
							$scope.AlumniEndDate = undefined;
						}
						$scope.LpuReferenceChange = function () {
							$scope.RefEmpCode = undefined;
							$scope.RefEmpName = undefined;
						}

						// //   submit regestration form

						$scope.SubmitReg = function (fromValid) {

							if (!fromValid) {
								return;
							}


							if ($scope.Subject != undefined) {
								if ($scope.Subject == 'Other') {
									if ($scope.OtherSubject == '' || $scope.OtherSubject == undefined) {
										swal("Please Fill Other Subject");
										return;
									}
								}
							}

							if ($scope.City != undefined) {
								if ($scope.City.city == 'Other') {
									if ($scope.District == '' || $scope.District == undefined || $scope.State == '' || $scope.State == undefined ||
										$scope.Country == '' || $scope.Country == undefined) {
										swal("Please Fill District/State/Country");
										return;
									}
								}
							}


							if ($scope.MediaRefrence != undefined) {
								if ($scope.MediaRefrence == 'Others') {
									if ($scope.OtherRef == '' || $scope.OtherRef == undefined) {
										swal("Please Fill Media Reference");
										return;
									}
								}
							}

							if ($scope.xEmp != undefined) {
								if ($scope.xEmp == 'Yes') {
									if ($scope.xUID == '' || $scope.xUID == undefined || $scope.xDept == '' || $scope.xDept == undefined ||
										$scope.xStartDate == '' || $scope.xStartDate == undefined || $scope.xEndDate == '' || $scope.xEndDate == undefined) {
										swal("Please Fill LPU Working Profile");
										return;
									}
								}
							}


							if ($scope.Alumni != undefined) {
								if ($scope.Alumni == 'Yes') {
									if ($scope.RegNo == '' || $scope.RegNo == undefined || $scope.Program == '' || $scope.Program == undefined ||
										$scope.AlumniStartDate == '' || $scope.AlumniStartDate == undefined || $scope.AlumniEndDate == '' || $scope.AlumniEndDate == undefined) {
										swal("Please Fill LPU Alumni Detail");
										return;
									}
								}
							}

							if ($scope.LpuRef != undefined) {
								if ($scope.LpuRef == 'Yes') {
									if ($scope.RefEmpCode == '' || $scope.RefEmpCode == undefined || $scope.RefEmpName == '' || $scope.RefEmpName == undefined) {
										swal("Please Fill LPU Reference Detail");
										return;
									}
								}
							}


							// Date of Birth Check


							var today = new Date();
							var dd = today.getDate();
							var mm = today.getMonth() + 1; //January is 0!
							var yyyy = today.getFullYear();
							if (dd < 10) {
								dd = '0' + dd
							}
							if (mm < 10) {
								mm = '0' + mm
							}
							today = yyyy + '/' + mm + '/' + dd;
							
							var d1 = $scope.DOB.split('/');
							var d1 = d1[2] + '/' + d1[1] + '/' + d1[0]; // year/month/day format
							

							var date2 = new Date(today);
							var date1 = new Date(d1);
							var timeDiff = (date2.getTime() - date1.getTime()); // miliseconds
							var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

							if (18 > (dayDifference) / 365) {
								swal("Applicant's minimum age must be 18 years");
								return;
							}


							// // get professional profile detail

							$scope.ProfessionalProfileDetail = [];
							var ppd = {};


							if ($scope.Appointment != undefined) {
								ppd.AppointmentCategory = $scope.Appointment;
							}


							if ($scope.AvailPost != undefined) {
								ppd.PostApplied = $scope.AvailPost;
							}

							ppd.AreaOfSpecialization = $scope.AreaOfSpecialization;
							ppd.Qualification = $scope.Qualification;

							if ($scope.Subject != undefined) {
								ppd.Subject = $scope.Subject;
							}

							if ($scope.OtherSubject == undefined || $scope.OtherSubject=='') {
								ppd.OtherSubject = null;
							}
							else {
								ppd.OtherSubject = $scope.OtherSubject;
							}

							$scope.ProfessionalProfileDetail.push(ppd);

							if ($scope.txtRegistrationNumber == undefined || $scope.txtRegistrationNumber == '') {
								ppd.RegistrationNumber = null;
							}
							else
							{
								ppd.RegistrationNumber = $scope.txtRegistrationNumber;
							}

							// // get personal & contact detail

							$scope.PersonalContactDetail = [];

							var pcd = {};

							if ($scope.Title != undefined) {
								pcd.Ttl = $scope.Title;
							}

							pcd.name = $scope.Name;
							pcd.fname = $scope.FName;
							pcd.mname = $scope.MName;


							if ($scope.Category != undefined) {
								pcd.castcategory = $scope.Category;
							}

							pcd.PDOB = $scope.DOB;


							if ($scope.Nationality != undefined) {
								pcd.national = $scope.Nationality;
							}

							pcd.marital = $scope.MaritalStatus;
							pcd.address = $scope.Address;


							if ($scope.City != undefined) {
								pcd.TownCity = $scope.City;
							}

							pcd.District = $scope.District;
							pcd.State = $scope.State;
							pcd.Country = $scope.Country;
							pcd.PostalCode = $scope.ZipCode;
							pcd.mblNo = $scope.Mobile;
							pcd.Aadharno = $scope.Aadhar;

							if ($scope.PAN == undefined || $scope.PAN=='') {
								pcd.PanNo = null;
							}
							else {
								pcd.PanNo = $scope.PAN;
							}

							pcd.email = $scope.pEmail;

							$scope.PersonalContactDetail.push(pcd);

							console.log($scope.PersonalContactDetail);

							// // get education detail 

							var educationList;
							if ($scope.EducationDetail.length == 0) {
								swal("Please Fill Education Detail");
								return;
							}
							else {
								educationList = $scope.EducationDetail;
							}

							var PHdTitle = $scope.PhdTitle;
							if (PHdTitle == undefined || PHdTitle == '')  {
								PHdTitle =null;
							}

							var DOA = $scope.PhdAwardDetail;
							if (DOA == undefined || DOA == '')  {
								DOA = null;
							}


							// // get experience detail

							$scope.Experice = [];
							var exp = {};

							if ($scope.ExpTeachYear != undefined) {
								exp.ExperienceTY = $scope.ExpTeachYear;
							}


							if ($scope.ExpTeachMonth != undefined) {
								exp.ExperienceTM = $scope.ExpTeachMonth;
							}


							if ($scope.ExpResYear != undefined) {
								exp.ExperienceRY = $scope.ExpResYear;
							}


							if ($scope.ExpResMonth != undefined) {
								exp.ExperienceRM = $scope.ExpResMonth;
							}


							if ($scope.ExpIndYear != undefined) {
								exp.ExperienceIY = $scope.ExpIndYear;
							}


							if ($scope.ExpIndMonth != undefined) {
								exp.ExperienceIM = $scope.ExpIndMonth;
							}

							$scope.Experice.push(exp);

							console.log($scope.Experice);

							// get experice detail table

							if ($scope.ExperienceDetail == undefined || $scope.ExperienceDetail.length == 0)  {
								$scope.ExperienceDetail = [];
							}



							// // get way of responding detail

							var MediaRef;
							if ($scope.MediaRefrence != undefined) {
								MediaRef = $scope.MediaRefrence;
							}
							var OtherMediaRef = $scope.OtherRef;
							if (OtherMediaRef == undefined || OtherMediaRef == '')  {
								OtherMediaRef = null;
							}


							// // get Lpu workng profile detail

							$scope.ExLpu = [];
							var x = {};

							if ($scope.xEmp == 'Yes') {
								x.xLpu = 1;
							}
							else { x.xLpu = 0; }



							x.xLpuUID = $scope.xUID;
							if (x.xLpuUID == undefined || x.xLpuUID == '')  {
								x.xLpuUID = null;
							}

							x.xLpuDept = $scope.xDept;
							if (x.xLpuDept == undefined || x.xLpuDept == '')  {
								x.xLpuDept = null;
							}
							x.xLpuStartDate = $scope.xStartDate;
							if (x.xLpuStartDate == undefined || x.xLpuStartDate == '')  {
								x.xLpuStartDate = null;
							}

							x.XLpuEndDate = $scope.xEndDate;
							if (x.XLpuEndDate == undefined || x.XLpuEndDate == '')  {
								x.XLpuEndDate = null;
							}

							$scope.ExLpu.push(x);
							console.log($scope.ExLpu);

							// // get Lpu alumni detail

							$scope.LpuAlumni = [];
							var alm = {};

							if ($scope.Alumni == 'Yes') {
								alm.isAlumni = 1;
							}
							else {
								alm.isAlumni = 0;
							}

							alm.AlumniRegNo = $scope.RegNo;
							if (alm.AlumniRegNo == undefined || alm.AlumniRegNo == '') {
								alm.AlumniRegNo = null;
							}

							alm.AlumniProgram = $scope.Program;
							if (alm.AlumniProgram == undefined || alm.AlumniProgram == '') {
								alm.AlumniProgram = null;
							}

							alm.AlumniStart = $scope.AlumniStartDate;
							if (alm.AlumniStart == undefined || alm.AlumniStart == '') {
								alm.AlumniStart = null;
							}

							alm.AlimniEndDate = $scope.AlumniEndDate;
							if (alm.AlimniEndDate == undefined || alm.AlimniEndDate == '') {
								alm.AlimniEndDate = null;
							}

							$scope.LpuAlumni.push(alm);
							console.log($scope.LpuAlumni);

							// // get Lpu reference detail

							if ($scope.LpuRef == 'Yes') {
								var isLpuRef = 1;
							}
							else {
								var isLpuRef = 0;
							}
							var isLpuRefEmpCode = $scope.RefEmpCode;
							if (isLpuRefEmpCode == undefined || isLpuRefEmpCode == '') {
								isLpuRefEmpCode = null;
							}
							var isLpuRefEmpName = $scope.RefEmpName;
							if (isLpuRefEmpName == undefined || isLpuRefEmpName == '') {
								isLpuRefEmpName = null;
							}


							// // get source of response detail (conveninet way t contact)

							var SourceOfResponse = $scope.WayToConnect;

							//// logic to call service and save data to database

							var AID = sessionStorage.getItem("AppID");
							if (AID == undefined || AID == 'undefined') {
								AID = null;
							}

							var req = {
								method: 'POST',
								url: "BasicServices.asmx/SaveRegistarionDetail",
								data: {
									pp: $scope.ProfessionalProfileDetail,
									pc: $scope.PersonalContactDetail,
									eduList: educationList, PhdTitle: PHdTitle, DOA: DOA,
									ed: $scope.Experice, expList: $scope.ExperienceDetail,
									WayOfResp: MediaRef, OtherWayOfResp: OtherMediaRef,
									xemp: $scope.ExLpu,
									alm: $scope.LpuAlumni,
									LpuRef: isLpuRef, RefUid: isLpuRefEmpCode, RefName: isLpuRefEmpName,
									WaytoRespond: SourceOfResponse,
									ApplicationId: AID
								}
							}
							$http(req).then(function (response) {
								var AppId = response.data.d;
								if (AppId == undefined || AppId == '') {
									swal("Oops!!! Something went wrong. Please contact to admin");
								}
								else {
									sessionStorage.setItem("AppID", AppId);
									swal("Done", "Saved Successfully", "success");

									$timeout(function () {
										$window.location.href = '/OtherDetails.html';
									}, 2000);


									//$window.location.href = '/OtherDetails.html';
								}
							});

						}

						$scope.ResetReg = function () {
							$window.location.reload();
						}

						// loading on
						if (sessionStorage.getItem("IsUpdate") == 'Yes') {
							var AID = sessionStorage.getItem("AppID");                            
							var req = {
								method: 'POST',
								url: "BasicServices.asmx/getSavedRegistarionData",
								data: {
									AppID: AID
								}
							}
						   
							$http(req).then(function (response) {
								console.log(response.data.d);
								
								$scope.Appointment = response.data.d.RegData[0].AppoinmentCategory;
								$scope.getPost($scope.Appointment);
								$scope.AvailPost = response.data.d.RegData[0].PostApplied;
								$scope.AreaOfSpecialization = response.data.d.RegData[0].AreaOfSpecilization;
								$scope.Qualification = response.data.d.RegData[0].Qualification;
								$scope.Subject = response.data.d.RegData[0].Subject;
								$scope.OtherSubject = response.data.d.RegData[0].OtherSubject;
								$scope.ArchiAndPahrmaCheck($scope.Subject);
								if (response.data.d.RegData[0].RegNo == undefined || response.data.d.RegData[0].RegNo == '') {
									$scope.RegistartionNumberVisible = false;
								}
								else
								{
									$scope.RegistartionNumberVisible = true;
									$scope.txtRegistrationNumber = response.data.d.RegData[0].RegNo;
								}
								

								$scope.Title = response.data.d.RegData[0].Title;
								$scope.Name = response.data.d.RegData[0].Name;
								$scope.FName = response.data.d.RegData[0].FatherName;
								$scope.MName = response.data.d.RegData[0].MotherName;
								$scope.Category = response.data.d.RegData[0].Category;
								$scope.DOB = response.data.d.RegData[0].DateOfBirth;
								$scope.Nationality = response.data.d.RegData[0].Nationality;
								$scope.MaritalStatus = response.data.d.RegData[0].MaritalStatus;
								$scope.Address = response.data.d.RegData[0].Address;
								$scope.City = response.data.d.RegData[0].City;
								$scope.District = response.data.d.RegData[0].District;
								$scope.State = response.data.d.RegData[0].State;
								$scope.Country = response.data.d.RegData[0].Country;
								$scope.ZipCode = response.data.d.RegData[0].PinCode;
								$scope.Mobile = response.data.d.RegData[0].MobileNumber;
								$scope.Aadhar = response.data.d.RegData[0].AadhaarNo;
								$scope.PAN = response.data.d.RegData[0].PanCardNo;
								$scope.pEmail = response.data.d.RegData[0].Email;

								$scope.PhdTitle = response.data.d.RegData[0].PhdTitle;
								$scope.PhdAwardDetail = response.data.d.RegData[0].DateOfAward;

								$scope.ExpTeachYear = response.data.d.RegData[0].ExpTeaching;
								$scope.ExpTeachMonth = response.data.d.RegData[0].ExpTeachMonths;
								$scope.ExpResYear = response.data.d.RegData[0].ExpResearch;
								$scope.ExpResMonth = response.data.d.RegData[0].ExpResearchMonths;
								$scope.ExpIndYear = response.data.d.RegData[0].ExpIndustry;
								$scope.ExpIndMonth = response.data.d.RegData[0].ExpIndusMonths;

								$scope.MediaRefrence = response.data.d.RegData[0].Reference;
								$scope.OtherRef = response.data.d.RegData[0].OtherReference;

																
								if (response.data.d.RegData[0].WorkAtLPU == 'True') {
									$scope.xEmp = 'Yes';
								}
								else {
									$scope.xEmp = 'No';
								}

								$scope.xUID = response.data.d.RegData[0].EmpCode;
								$scope.xDept = response.data.d.RegData[0].LPUDept;
								$scope.xStartDate = response.data.d.RegData[0].StartsFrom;
								$scope.xEndDate = response.data.d.RegData[0].EndTo;

								
								if (response.data.d.RegData[0].StudiedAtLPU == 'True') {
									$scope.Alumni = 'Yes';
								}
								else
								{
									$scope.Alumni = 'No';
								}
								$scope.RegNo = response.data.d.RegData[0].Regnumber;
								$scope.Program = response.data.d.RegData[0].studentProgram;
								$scope.AlumniStartDate = response.data.d.RegData[0].StudyFrom;
								$scope.AlumniEndDate = response.data.d.RegData[0].Studyto;

								if (response.data.d.RegData[0].LPUReference == 'True') {
									$scope.LpuRef = 'Yes';
								}
								else {
									$scope.LpuRef = 'No';
								}
								
								$scope.RefEmpCode = response.data.d.RegData[0].LPUReferenceCode;
								$scope.RefEmpName = response.data.d.RegData[0].LPUReferenceName;
								$scope.WayToConnect = response.data.d.RegData[0].SourceOfResponse;
															   
								for (var a = 0; a < response.data.d.EDO.length; a++) {
									var ed = {};
									ed.EducationDOCM = response.data.d.EDO[a].EducationDOCM;
									ed.EducationDOCY = response.data.d.EDO[a].EducationDOCY;
									ed.EducationExam = response.data.d.EDO[a].EducationExam;
									ed.EducationMarks = response.data.d.EDO[a].EducationMarks;
									ed.EducationMode = response.data.d.EDO[a].EducationMode;
									ed.EducationStatus = response.data.d.EDO[a].EducationStatus;
									ed.EducationYOP = response.data.d.EDO[a].EducationYOP;
									ed.EducationdCollege = response.data.d.EDO[a].EducationdCollege;
									ed.EducationdDegree = response.data.d.EDO[a].EducationdDegree;
									ed.EducationdSubject = response.data.d.EDO[a].EducationdSubject;
									ed.EducationdUni = response.data.d.EDO[a].EducationdUni;
									$scope.EducationDetail.push(ed);
								}
								if ($scope.EducationDetail.length > 0) {
									$scope.EducationAddedTable = true;
								}
								

								if (response.data.d.ExpData.length > 0)
								{
									for (var a = 0; a < response.data.d.ExpData.length; a++) {
										var exp = {};
										exp.University = response.data.d.ExpData[a].University;
										exp.Designation = response.data.d.ExpData[a].Designation;
										exp.StartDate = response.data.d.ExpData[a].StartDate;
										exp.EndDate = response.data.d.ExpData[a].EndDate;
										exp.Salary = response.data.d.ExpData[a].Salary;
										exp.Reason = response.data.d.ExpData[a].Reason;
										$scope.ExperienceDetail.push(exp);
									}
									if ($scope.ExperienceDetail.length > 0) {
										$scope.ExperienceAddedTable = true;
									}

								}

							});
						}
					
					

				})

				.controller("OtherCntrl", function ($scope, $http, $window,$timeout) {

					var AID = sessionStorage.getItem("AppID");
					if (AID == undefined || AID == null || AID == '')
					{
						//swal("Application ID is not valid");
						//return;
					}
					$scope.OtherApplicationId = AID;

					$scope.BloodGroups = [{ Bgroup: 'A+' }, { Bgroup: 'A-' }, { Bgroup: 'B+' }, { Bgroup: 'B-' }, { Bgroup: 'AB+' }, { Bgroup: 'AB-' }, { Bgroup: 'O+' }, { Bgroup: 'O-' }];

					// Other Detail Submit

					$scope.OtherDetailSubmit = function (fromValid) {

						if (!fromValid) {                            
							return;
						}

						if ($scope.Smoking != undefined) {
							if ($scope.Smoking == 'Yes') {
								if ($scope.SmockingFrequency == '' || $scope.SmockingFrequency == undefined) {
									swal("Please Fill Smoking Frequency");
									return;
								}
							}
						}

						if ($scope.Alcohol != undefined) {
							if ($scope.Alcohol == 'Yes') {
								if ($scope.AlcoholFrequency == '' || $scope.AlcoholFrequency == undefined) {
									swal("Please Fill Alcohol Frequency");
									return;
								}
							}
						}

						if ($scope.Tobacco != undefined) {
							if ($scope.Tobacco == 'Yes') {
								if ($scope.TobaccoFrequency == '' || $scope.TobaccoFrequency == undefined) {
									swal("Please Fill Tobacco Frequency");
									return;
								}
							}
						}

						// Reasearch and langulage detail
						var ResearchA = $scope.ResearchActivityA;
						if (ResearchA == undefined || ResearchA == '') {
							ResearchA = null;
						}
						var ResearchB = $scope.ResearchActivityB;
						if (ResearchB == undefined || ResearchB == '') {
							ResearchB = null;
						}
						var ReseachC = $scope.ResearchActivityC;
						if (ReseachC == undefined || ReseachC == '') {
							ReseachC = null;
						}
						var LangSpeak = $scope.LanguageSpeak;
						var LangRead = $scope.LanguageRead;
						var LangWrite = $scope.LanguageWrite;
						
						// Reference detail

						$scope.ReferenceDetail = [];                        
						for (var i = 0; i <= 2; i++)
						{
							var Ref = {};
							if (i == 0) {
								Ref.Name = $scope.FirstRefName;
								Ref.Occupation = $scope.FirstRefOccupation;
								Ref.Address = $scope.FirstRefAddress;
								Ref.Contact = $scope.FirstRefContact;
								Ref.Email = $scope.FirstRefEmail;
								Ref.KnownSince = $scope.FirstRefKnownSince;
								if (Ref.Name != undefined) {
									$scope.ReferenceDetail.push(Ref);
								}
								
								
							}
							else if (i == 1) {
								Ref.Name = $scope.SecondRefName;
								Ref.Occupation = $scope.SecondRefOccupation;
								Ref.Address = $scope.SecondRefAddress;
								Ref.Contact = $scope.SecondRefContact;
								Ref.Email = $scope.SecondRefEmail;
								Ref.KnownSince = $scope.SecondRefKnownSince;
								if (Ref.Name != undefined) {
									$scope.ReferenceDetail.push(Ref);
								}                                

							}
							else if (i == 2) {
								Ref.Name = $scope.ThirdRefName;
								Ref.Occupation = $scope.ThirdRefOccupation;
								Ref.Address = $scope.ThirdRefAddress;
								Ref.Contact = $scope.ThirdRefContact;
								Ref.Email = $scope.ThirdRefEmail;
								Ref.KnownSince = $scope.ThirdRefKnownSince;
								if (Ref.Name != undefined) {
									$scope.ReferenceDetail.push(Ref);
								}
							}
						}                       
						
						// Family Detail

						$scope.FamilyDetail = [];
						
						for (var i = 0; i <= 2; i++) {
							var Fam = {};
							if (i == 0) {
								Fam.Name = $scope.FirstFamilytName;
								Fam.Relation = $scope.FirstFamilytRelation;
								Fam.Age = $scope.FirstFamilytAge;
								Fam.Contact = $scope.FirstFamilytContactNo;
								Fam.Email = $scope.FirstFamilytEmail;
								Fam.Qualification = $scope.FirstFamilytQualification;
								Fam.Profession = $scope.FirstFamilytProfession;
								Fam.Organization = $scope.FirstFamilytOrganization;
								if (Fam.Name != undefined) {
									$scope.FamilyDetail.push(Fam);
								}
								
							}
							else if (i == 1) {
								Fam.Name = $scope.SecondFamilytName;
								Fam.Relation = $scope.SecondFamilytRelation;
								Fam.Age = $scope.SecondFamilytAge;
								Fam.Contact = $scope.SecondFamilytContactNo;
								Fam.Email = $scope.SecondFamilytEmail;
								Fam.Qualification = $scope.SecondFamilytQualification;
								Fam.Profession = $scope.SecondFamilytProfession;
								Fam.Organization = $scope.SecondFamilytOrganization;                                
								if (Fam.Name != undefined) {
									$scope.FamilyDetail.push(Fam);
								}
							}
							else if (i == 2) {
								Fam.Name = $scope.ThirdFamilytName;
								Fam.Relation = $scope.ThirdFamilytRelation;
								Fam.Age = $scope.ThirdFamilytAge;
								Fam.Contact = $scope.ThirdFamilytContactNo;
								Fam.Email = $scope.ThirdFamilytEmail;
								Fam.Qualification = $scope.ThirdFamilytQualification;
								Fam.Profession = $scope.ThirdFamilytProfession;
								Fam.Organization = $scope.ThirdFamilytOrganization;                                
								if (Fam.Name != undefined) {
									$scope.FamilyDetail.push(Fam);
								}
							}

						}
						
						// health Detail

						$scope.HealthDetail = [];

						var hd = {};
						var BGroup;
						if ($scope.BloodGroup != undefined) {
							BGroup = $scope.BloodGroup;
						}
						
						hd.BloodGroup = BGroup;
						hd.Height= $scope.Height;                       
						hd.Weight = $scope.Weight;
						hd.Ey = $scope.EyeSight;
						hd.CDiseas = $scope.chroincDiseas;
						hd.Ent = $scope.EntProblem;
						hd.Phy = $scope.PhysicalHandicap;
						hd.Alr = $scope.Allergy;

						$scope.HealthDetail.push(hd);
					   
						// personal habits

						var smk = $scope.Smoking;
						if (smk == 'Yes') {
							smk = $scope.SmockingFrequency;
						}

						var Alc = $scope.Alcohol;
						if (Alc == 'Yes') {
							Alc = $scope.AlcoholFrequency;
						}

						var Tbc = $scope.Tobacco;
						if (Tbc == 'Yes') {
							Tbc = $scope.TobaccoFrequency;
						}
						var OtherHab = $scope.OtherHabitFrequency;

						$scope.HabitDetail = [];
						var hbt = {};
						hbt.Smoking = smk;
						hbt.Alcohal = Alc;
						hbt.Tobacco = Tbc;
						hbt.Other = OtherHab;
						$scope.HabitDetail.push(hbt);

						var AppID = $scope.OtherApplicationId;

						var req = {
							method: 'POST',
							url: "BasicServices.asmx/SaveOtherDetail",
							data: {
								SessionAppId: AppID, ResearchActivity: ResearchA, Participation: ResearchB, Talents: ReseachC, LSpeak: LangSpeak, LRead: LangRead, LWrite: LangWrite,
								refList: $scope.ReferenceDetail, famList: $scope.FamilyDetail, healthList: $scope.HealthDetail, habitList: $scope.HabitDetail
							}
							
						}
						$http(req).then(function (response) {
							var ApplicantCategory = response.data.d;

							if (ApplicantCategory == 'T') {

								swal("Done", "Saved Successfully", "success");
								$timeout(function () {
									$window.location.href = '/SubjectPreference.html';
								}, 2000);

								
							}
							else
							{
								swal("Done", "Saved Successfully", "success");
								$timeout(function () {
									$window.location.href = '/GeneratePassword.html';
								}, 2000);
								
							}
							
						});
					}

					$scope.OtherDetailReset = function () {
					   $window.location.reload();
					}

					if (sessionStorage.getItem("IsUpdate") == 'Yes') {
						var AID = sessionStorage.getItem("AppID");
						var req = {
							method: 'POST',
							url: "BasicServices.asmx/getSavedOtherDetail",
							data: {
								AppID: AID
							}
						}
						$http(req).then(function (response) {
							console.log(response.data.d);
							$scope.ResearchActivityA = response.data.d.SOD[0].ResearchActivity;
							$scope.ResearchActivityB = response.data.d.SOD[0].Participation;
							$scope.ResearchActivityC = response.data.d.SOD[0].Talents;
							$scope.LanguageSpeak = response.data.d.SOD[0].LanguageSpeak;
							$scope.LanguageRead = response.data.d.SOD[0].LanguageRead;
							$scope.LanguageWrite = response.data.d.SOD[0].LanguageWrite;


							// health

							$scope.BloodGroup = response.data.d.HEA[0].BloodGroup;
							$scope.Height = response.data.d.HEA[0].Height;
							$scope.Weight = response.data.d.HEA[0].Weight;
							$scope.EyeSight = response.data.d.HEA[0].Ey;
							$scope.chroincDiseas = response.data.d.HEA[0].CDiseas;
							$scope.EntProblem = response.data.d.HEA[0].Ent;
							$scope.PhysicalHandicap = response.data.d.HEA[0].Phy;
							$scope.Allergy = response.data.d.HEA[0].Alr;

							// habit

							if (response.data.d.HAB[0].Smoking != 'No') {
								$scope.Smoking = "Yes";
								$scope.SmockingFrequency = response.data.d.HAB[0].Smoking;
							}
							else {
								$scope.Smoking = "No";
							}

							if (response.data.d.HAB[0].Alcohal != 'No') {
								$scope.Alcohol = "Yes";
								$scope.AlcoholFrequency = response.data.d.HAB[0].Alcohal;
							}
							else {
								$scope.Alcohol = "No";
							}

							if (response.data.d.HAB[0].Tobacco != 'No') {
								$scope.Tobacco = "Yes";
								$scope.TobaccoFrequency = response.data.d.HAB[0].Tobacco;
							}
							else {
								$scope.Tobacco = "No"; 
							}

							$scope.OtherHabitFrequency = response.data.d.HAB[0].Other;

							// family

							if (response.data.d.FAM.length > 0) {
								for (var a = 0; a < response.data.d.FAM.length; a++) {
									if (a == 0) {
										$scope.FirstFamilytName = response.data.d.FAM[a].Name;
										$scope.FirstFamilytRelation = response.data.d.FAM[a].Relation;
										$scope.FirstFamilytAge = response.data.d.FAM[a].Age;
										$scope.FirstFamilytContactNo = response.data.d.FAM[a].Contact;
										$scope.FirstFamilytEmail = response.data.d.FAM[a].Email;
										$scope.FirstFamilytQualification = response.data.d.FAM[a].Qualification;
										$scope.FirstFamilytProfession = response.data.d.FAM[a].Profession;
										$scope.FirstFamilytOrganization = response.data.d.FAM[a].Organization;
									}
									if (a == 1) {
										$scope.SecondFamilytName = response.data.d.FAM[a].Name;
										$scope.SecondFamilytRelation = response.data.d.FAM[a].Relation;
										$scope.SecondFamilytAge = response.data.d.FAM[a].Age;
										$scope.SecondFamilytContactNo = response.data.d.FAM[a].Contact;
										$scope.SecondFamilytEmail = response.data.d.FAM[a].Email;
										$scope.SecondFamilytQualification = response.data.d.FAM[a].Qualification;
										$scope.SecondFamilytProfession = response.data.d.FAM[a].Profession;
										$scope.SecondFamilytOrganization = response.data.d.FAM[a].Organization;
									}
									if (a == 2) {
										$scope.ThirdFamilytName = response.data.d.FAM[a].Name;
										$scope.ThirdFamilytRelation = response.data.d.FAM[a].Relation;
										$scope.ThirdFamilytAge = response.data.d.FAM[a].Age;
										$scope.ThirdFamilytContactNo = response.data.d.FAM[a].Contact;
										$scope.ThirdFamilytEmail = response.data.d.FAM[a].Email;
										$scope.ThirdFamilytQualification = response.data.d.FAM[a].Qualification;
										$scope.ThirdFamilytProfession = response.data.d.FAM[a].Profession;
										$scope.ThirdFamilytOrganization = response.data.d.FAM[a].Organization;
									}
								}
							}

							// reference

							if (response.data.d.REF.length > 0) {

								for (var a = 0; a < response.data.d.REF.length; a++) {
									if (a == 0) {
										$scope.FirstRefName = response.data.d.REF[a].Name;
										$scope.FirstRefOccupation = response.data.d.REF[a].Name;
										$scope.FirstRefAddress = response.data.d.REF[a].Address;
										$scope.FirstRefContact = response.data.d.REF[a].Contact;
										$scope.FirstRefEmail = response.data.d.REF[a].Email;
										$scope.FirstRefKnownSince = response.data.d.REF[a].KnownSince;
									}
									if (a == 1) {
										$scope.SecondRefName = response.data.d.REF[a].Name;
										$scope.SecondRefOccupation = response.data.d.REF[a].Name;
										$scope.SecondRefAddress = response.data.d.REF[a].Address;
										$scope.SecondRefContact = response.data.d.REF[a].Contact;
										$scope.SecondRefEmail = response.data.d.REF[a].Email;
										$scope.SecondRefKnownSince = response.data.d.REF[a].KnownSince;
									}
									if (a == 2) {
										$scope.ThirdRefName = response.data.d.REF[a].Name;
										$scope.ThirdRefOccupation = response.data.d.REF[a].Name;
										$scope.ThirdRefAddress = response.data.d.REF[a].Address;
										$scope.ThirdRefContact = response.data.d.REF[a].Contact;
										$scope.ThirdRefEmail = response.data.d.REF[a].Email;
										$scope.ThirdRefKnownSince = response.data.d.REF[a].KnownSince;
									}
								}
							}


						});
					}
					

				})

				.controller("SubPrefCntrl", function ($scope, $http, $window,$timeout) {                    

					var AID = sessionStorage.getItem("AppID");
					if (AID == undefined || AID == null || AID == '') {
						swal("Please Re-Login");
						$window.location.href = '/LoginPage.html'
						return;
					}
					$scope.SubPrefApplicationId = AID;


					$http.get('BasicServices.asmx/GetSubjectStream')
					.then(function (response) {                        
						$scope.StreamSubject = response.data;
					});

					$scope.ExpYears = [{ Experience: '0' }, { Experience: '1' }, { Experience: '2' }, { Experience: '3' }, { Experience: '4' }, { Experience: '5' }, { Experience: '6' }, { Experience: '7' }, { Experience: '8' }, { Experience: '9' }, { Experience: '10' },
									 { Experience: '11' }, { Experience: '12' }, { Experience: '13' }, { Experience: '14' }, { Experience: '15' }, { Experience: '16' }, { Experience: '17' }, { Experience: '18' }, { Experience: '19' }, { Experience: '20' },
									 { Experience: '21' }, { Experience: '22' }, { Experience: '23' }, { Experience: '24' }, { Experience: '25' }, { Experience: '26' }, { Experience: '27' }, { Experience: '28' }, { Experience: '29' }, { Experience: '30' },
									 { Experience: '31' }, { Experience: '32' }, { Experience: '33' }, { Experience: '34' }, { Experience: '35' }, { Experience: '36' }, { Experience: '37' }, { Experience: '38' }, { Experience: '39' }, { Experience: '40' }
					];


					$scope.ReasonOfPreference = [{ Reasons: 'Clarity of concepts and sound knowledge of the subject' }, { Reasons: 'Research work in the subject/related subject' },
											   { Reasons: 'have experience and feel comfortable in subject teaching' }, { Reasons: 'Have interest in subject' }, { Reasons: 'Any Other' }];


					$scope.getSubjectStream = function (SubId) {
						var req = {
							method: 'POST',
							url: "BasicServices.asmx/getSubjects",
							data: { Subjectid: SubId }
						}
						$http(req).then(function (response) {
							//console.log(response.data.d);
							$scope.FirstSubjectCourse = response.data.d;
						});
					}

					$scope.CheckPreference = function (selectedSub, pref) {
						var count = 1;
						if (pref == '1') {
							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.FirstSubject = undefined; }

						}
						if (pref == '2') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.SecondSubject = undefined; }

						}
						if (pref == '3') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.ThirdSubject = undefined; }
						}
						if (pref == '4') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.ForthSubject = undefined; }
						}
						if (pref == '5') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.FiveSubject = undefined; }
						}
						if (pref == '6') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.SixSubject = undefined; }
						}
						if (pref == '7') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.EightSubject != undefined)
							{ if ($scope.EightSubject == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.SevenSubject = undefined; }
						}
						if (pref == '8') {
							if ($scope.FirstSubject != undefined)
							{ if ($scope.FirstSubject == selectedSub) { count += 1; } }

							if ($scope.SecondSubject != undefined)
							{ if ($scope.SecondSubject == selectedSub) { count += 1; } }

							if ($scope.ThirdSubject != undefined)
							{ if ($scope.ThirdSubject == selectedSub) { count += 1; } }

							if ($scope.ForthSubject != undefined)
							{ if ($scope.ForthSubject == selectedSub) { count += 1; } }

							if ($scope.FiveSubject != undefined)
							{ if ($scope.FiveSubject == selectedSub) { count += 1; } }

							if ($scope.SixSubject != undefined)
							{ if ($scope.SixSubject == selectedSub) { count += 1; } }

							if ($scope.SevenSubject != undefined)
							{ if ($scope.SevenSubject  == selectedSub) { count += 1; } }
							if (count > 1) { swal("Already Prefered"); $scope.EightSubject = undefined; }
						}
					}

					// Subject preference submit

					$scope.SubPrefSubmit = function (fromValid) {

						if (!fromValid) {
							return;
						}

						if ($scope.FirstReason != undefined) {
							if ($scope.FirstReason == 'Any Other') {
								if ($scope.FirstSubjectOthRea == undefined || $scope.FirstSubjectOthRea == '') {
									swal('Please Fill Other Reason Of First Preference');
									return;
								}
							}
						}
						if ($scope.SecondReason != undefined) {
							if ($scope.SecondReason == 'Any Other') {
								if ($scope.SecondSubjectOthRea == undefined || $scope.SecondSubjectOthRea == '') {
									swal('Please Other Reason Of Second Preference');
									return;
								}
							}
						}
						if ($scope.ThirdReason != undefined) {
							if ($scope.ThirdReason == 'Any Other') {
								if ($scope.ThirdSubjectOthRea == undefined || $scope.ThirdSubjectOthRea == '') {
									swal('Please Other Reason Of Third Preference');
									return;
								}
							}
						}
						if ($scope.ForthReason != undefined) {
							if ($scope.ForthReason == 'Any Other') {
								if ($scope.ForthSubjectOthRea == undefined || $scope.ForthSubjectOthRea == '') {
									swal('Please Other Reason Of Forth Preference');
									return;
								}
							}
						}
						if ($scope.FiveReason != undefined) {
							if ($scope.FiveReason == 'Any Other') {
								if ($scope.FiveSubjectOthRea == undefined || $scope.FiveSubjectOthRea == '') {
									swal('Please Other Reason Of Fifth Preference');
									return;
								}
							}
						}
						if ($scope.SixReason != undefined) {
							if ($scope.SixReason == 'Any Other') {
								if ($scope.SixSubjectOthRea == undefined || $scope.SixSubjectOthRea == '') {
									swal('Please Other Reason Of Sixth Preference');
									return;
								}
							}
						}
						if ($scope.SevenReason != undefined) {
							if ($scope.SevenReason == 'Any Other') {
								if ($scope.SevenSubjectOthRea == undefined || $scope.SevenSubjectOthRea == '') {
									swal('Please Other Reason Of Seventh Preference');
									return;
								}
							}
						}
						if ($scope.EightReason != undefined) {
							if ($scope.EightReason == 'Any Other') {
								if ($scope.EightSubjectOthRea == undefined || $scope.EightSubjectOthRea == '') {
									swal('Please Other Reason Of Eighth Preference');
									return;
								}
							}
						}

						var mainSubjectId;
						if ($scope.MainSubjectStream != undefined) {
							mainSubjectId = $scope.MainSubjectStream;
						}
						

						$scope.PreferenceDetail = [];

						for (var i = 1; i <= 8; i++) {
							var SubPref = {};
							if (i == 1)
							{
								
								SubPref.Subject = $scope.FirstSubject;                                
								SubPref.Reason = $scope.FirstReason;
								if ($scope.FirstReason == 'Any Other') {
									SubPref.OtherReason = $scope.FirstSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.FirstSubjectExp;
								SubPref.Preference = 'First';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 2)
							{
								
								SubPref.Subject = $scope.SecondSubject;
								
								SubPref.Reason = $scope.SecondReason;
								if ($scope.SecondReason == 'Any Other') {
									SubPref.OtherReason = $scope.SecondSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.SecondSubjectExp;
								SubPref.Preference = 'Second';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 3) {
								
									SubPref.Subject = $scope.ThirdSubject;
								
								
								SubPref.Reason = $scope.ThirdReason;
								if ($scope.ThirdReason == 'Any Other') {
									SubPref.OtherReason = $scope.ThirdSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.ThirdSubjectExp;
								SubPref.Preference = 'Third';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 4) {
							   
									SubPref.Subject = $scope.ForthSubject;
							   
								
								SubPref.Reason = $scope.ForthReason;
								if ($scope.ForthReason == 'Any Other') {
									SubPref.OtherReason = $scope.ForthSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.ForthSubjectExp;
								SubPref.Preference = 'Fourth';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 5) {
								
									SubPref.Subject = $scope.FiveSubject;
								
								
								SubPref.Reason = $scope.FiveReason;
								if ($scope.FiveReason == 'Any Other') {
									SubPref.OtherReason = $scope.FiveSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.FiveSubjectExp;
								SubPref.Preference = 'Fifth';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 6) {
								
									SubPref.Subject = $scope.SixSubject;
								
								SubPref.Reason = $scope.SixReason;
								if ($scope.SixReason == 'Any Other') {
									SubPref.OtherReason = $scope.SixSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.SixSubjectExp;
								SubPref.Preference = 'Sixth';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 7) {
								
								SubPref.Subject = $scope.SevenSubject;
								
								
								SubPref.Reason = $scope.SevenReason;
								if ($scope.SevenReason == 'Any Other') {
									SubPref.OtherReason = $scope.SevenSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.SevenSubjectExp;
								SubPref.Preference = 'Seventh';
								$scope.PreferenceDetail.push(SubPref);
							}
							else if (i == 8) {
							   
								SubPref.Subject = $scope.EightSubject;
							   
								
								SubPref.Reason = $scope.EightReason;
								if ($scope.EightReason == 'Any Other') {
									SubPref.OtherReason = $scope.EightSubjectOthRea;
								}
								else {
									SubPref.OtherReason = null
								}
								SubPref.Experience = $scope.EightSubjectExp;
								SubPref.Preference = 'Eight';
								$scope.PreferenceDetail.push(SubPref);
							}
						}

						var req = {
							method: 'POST',
							url: "BasicServices.asmx/SaveSubjectPreference",
							data: {
								AppID: AID, MainSubId: mainSubjectId, prefDetail: $scope.PreferenceDetail
							}
							
						}
						$http(req).then(function (response) {
							var AppId = response.data.d;
							if (sessionStorage.getItem("AppID") == AppId) {
								sessionStorage.setItem("Subject", $scope.MainSubjectStream.subject);

								swal("Done", "Saved Successfully", "success");
								$timeout(function () {
									$window.location.href = '/GeneratePassword.html';
								}, 2000);

								
							}
							else {
								swal("Oops!! Something went wrong Contact to Admin");
								return;
							}
						});
						

					}

					$scope.SubPrefReset = function () {
						$window.location.reload();
					}

					if (sessionStorage.getItem("IsUpdate") == 'Yes') {
						var AID = sessionStorage.getItem("AppID");
						var req = {
							method: 'POST',
							url: "BasicServices.asmx/getSavedSubjectPreference",
							data: {
								AppID: AID
							}
						}
						$http(req).then(function (response) {
							console.log(response.data.d);

							if (response.data.d.length > 0) {
								$scope.MainSubjectStream = response.data.d[0].MainSubject;
								$scope.getSubjectStream($scope.MainSubjectStream);
								for (var i = 0; i < response.data.d.length; i++) {                                    
									if (i == 0) {
										$scope.FirstSubject = response.data.d[i].Subject;
										$scope.FirstReason = response.data.d[i].Reason;                                        
										$scope.FirstSubjectOthRea = response.data.d[i].OtherReason;
										$scope.FirstSubjectExp = response.data.d[i].Experience;
									}
									if (i == 1) {
										$scope.SecondSubject = response.data.d[i].Subject;
										$scope.SecondReason = response.data.d[i].Reason;
										$scope.SecondSubjectOthRea = response.data.d[i].OtherReason;
										$scope.SecondSubjectExp = response.data.d[i].Experience;
									}
									if (i == 2) {
										$scope.ThirdSubject = response.data.d[i].Subject;
										$scope.ThirdReason = response.data.d[i].Reason;
										$scope.ThirdSubjectOthRea = response.data.d[i].OtherReason;
										$scope.ThirdSubjectExp = response.data.d[i].Experience;
									}
									if (i == 3) {
										$scope.ForthSubject = response.data.d[i].Subject;
										$scope.ForthReason = response.data.d[i].Reason;
										$scope.ForthSubjectOthRea = response.data.d[i].OtherReason;
										$scope.ForthSubjectExp = response.data.d[i].Experience;
									}
									if (i == 4) {
										$scope.FiveSubject = response.data.d[i].Subject;
										$scope.FiveReason = response.data.d[i].Reason;
										$scope.FiveSubjectOthRea = response.data.d[i].OtherReason;
										$scope.FiveSubjectExp = response.data.d[i].Experience;
									}
									if (i == 5) {
										$scope.SixSubject = response.data.d[i].Subject;
										$scope.SixReason = response.data.d[i].Reason;
										$scope.SixSubjectOthRea = response.data.d[i].OtherReason;
										$scope.SixSubjectExp = response.data.d[i].Experience;
									}
									if (i == 6) {
										$scope.SevenSubject = response.data.d[i].Subject;
										$scope.SevenReason = response.data.d[i].Reason;
										$scope.SevenSubjectOthRea = response.data.d[i].OtherReason;
										$scope.SevenSubjectExp = response.data.d[i].Experience;
									}
									if (i == 7) {
										$scope.EightSubject = response.data.d[i].Subject;
										$scope.EightReason = response.data.d[i].Reason;
										$scope.EightSubjectOthRea = response.data.d[i].OtherReason;
										$scope.EightSubjectExp = response.data.d[i].Experience;
									}
								}
							}

						});
					}


				})

				.controller("PwdCntrl", function ($scope, $http, $window) {

					//sessionStorage.setItem("AppID","121");
					var AID="";
					if (sessionStorage.getItem("AppID") != undefined) {
						AID = sessionStorage.getItem("AppID");
						$scope.PwdApplicationId = AID;
					}
					else {
						swal("Please Re-Login");
						$window.location.href = '/LoginPage.html'
						return;
					}
					
										

					$scope.SavePassword = function (fromValid) {

						if (!fromValid) {
							return;
						}
						if ($scope.Password != $scope.ConfrimPassword) {
							swal("Passowrd Must Be Same");
							return;
						}

						var subject=sessionStorage.getItem("Subject");
						if (subject == 'null' || subject == undefined) {
							subject=undefined;
						}

						var req = {
							method: 'POST',
							url: "BasicServices.asmx/Password",
							data: {
								AppID: AID, pwd: $scope.Password, cpwd: $scope.ConfrimPassword, sub: subject
							}
						}
						$http(req).then(function (response) {                            
							if (response.data.d = "success") {
								swal("Saved Successfully");
								return;
							}
							else {
								swal("Oops!! Something went wrong Please Contact Admin");
								return;
							}
							
						});
					}

					

					//$scope.StartTest = function () {
					//    if (pwdsaved == 1) {
					//        swal($scope.TestSubject);
					//    }
					//    else {
					//        swal("Sorry!!", "Please Save Password First", "warning");
					//        return;
					//    }
					//}
				})
				
				.controller("ResearchCntrl", function ($scope, $http, $window) {

					var AID = sessionStorage.getItem("AppID");
					if (AID == undefined || AID == null || AID == '') {
						swal("Please Re-Login");
						$window.location.href = '/LoginPage.html'
						return;
					}
					$scope.ResearchApplicationId = AID;


					$scope.ResearchSubmit = function (fromValid) {

						if (!myform) {
							return;
						}

						$scope.ResearchDetail = [];
						var phdDetail = {};
																		
						if ($scope.ResearchScopusNo == undefined) {
							phdDetail.ScopusNo = null;
						}
						else {
							phdDetail.ScopusNo = $scope.ResearchScopusNo;
						}
						
						if ($scope.ResearchWosNo == undefined) {
							phdDetail.WosNo = null;
						} else {
							phdDetail.WosNo = $scope.ResearchWosNo;
						}
																		
						if ($scope.ConferenceIndexInScopus == undefined) {
							phdDetail.ConferenceIndexInScopus = null;
						} else {
							phdDetail.ConferenceIndexInScopus = $scope.ConferenceIndexInScopus;
						}
						
						if ($scope.GrantExternalFunding == undefined) {
							phdDetail.GrantExternalFunding = null;
						} else {
							phdDetail.GrantExternalFunding = $scope.GrantExternalFunding;

						}

						if ($scope.GrantApplied == undefined) {
							phdDetail.GrantApplied = null;
						} else {
							phdDetail.GrantApplied = $scope.GrantApplied;
						}

						if ($scope.PatentGranted == undefined) {
							phdDetail.PatentGranted = null;
						} else {
							phdDetail.PatentGranted = $scope.PatentGranted;
						}

						if ($scope.PatentFilled == undefined) {
							phdDetail.PatentFilled = null;
						} else {
							phdDetail.PatentFilled = $scope.PatentFilled;
						}

						if ($scope.PatentApproved == undefined) {
							phdDetail.PatentApproved = null;
						} else {
							phdDetail.PatentApproved = $scope.PatentApproved;
						}

						if ($scope.Copyright == undefined) {
							phdDetail.Copyright = null;
						} else {						    
							phdDetail.Copyright = $scope.Copyright;
						}
						
						if ($scope.BookPublished == undefined) {
							phdDetail.BookPublished = null;
						} else {
							phdDetail.BookPublished = $scope.BookPublished;
						}

						if ($scope.ConferenceRole == undefined) {
							phdDetail.ConferenceRole = null;
						} else {
							phdDetail.ConferenceRole = $scope.ConferenceRole;
						}

						if ($scope.PhdSupervised == undefined) {
							phdDetail.PhdSupervised = null;
						} else {
							phdDetail.PhdSupervised = $scope.PhdSupervised;
						}

						if ($scope.PhdSupervising == undefined) {
							phdDetail.PhdSupervising = null;
						} else {
							phdDetail.PhdSupervising = $scope.PhdSupervising;
						}
						
						if ($scope.MphilSupervised == undefined) {
							phdDetail.MphilSupervised = null;
						} else {
							phdDetail.MphilSupervised = $scope.MphilSupervised;
						}

						if ($scope.MphilSupervising == undefined) {
							phdDetail.MphilSupervising = null;
						} else {
							phdDetail.MphilSupervising = $scope.MphilSupervising;
						}

						if ($scope.AbroadVisit == undefined) {
							phdDetail.AbroadVisit = null;
						} else {
							phdDetail.AbroadVisit = $scope.AbroadVisit;
						}

						if ($scope.Hindex == undefined) {
							phdDetail.Hindex = null;
						} else {
							phdDetail.Hindex = $scope.Hindex;
						}

						if ($scope.Iindex == undefined) {
							phdDetail.Iindex = null;
						} else {
							phdDetail.Iindex = $scope.Iindex;
						}

						if ($scope.CountryVisited == undefined) {
							phdDetail.CountryVisited = null;
						} else {
							phdDetail.CountryVisited = $scope.CountryVisited;
						}

						if ($scope.CountryVisitedName == undefined) {
							phdDetail.CountryVisitedName = null;
						} else {
							phdDetail.CountryVisitedName = $scope.CountryVisitedName;
						}					    

						if ($scope.AchievementsAcademics == undefined) {
							phdDetail.AchievementsAcademics = null;
						} else {
							phdDetail.AchievementsAcademics = $scope.AchievementsAcademics;
						}

						if ($scope.AchievementsResearch == undefined) {
							phdDetail.AchievementsResearch = null;
						} else {
							phdDetail.AchievementsResearch = $scope.AchievementsResearch;
						}

						if ($scope.AchievementsIndustry == undefined) {
							phdDetail.AchievementsIndustry = null;
						} else {
							phdDetail.AchievementsIndustry = $scope.AchievementsIndustry;
						}

						if ($scope.AchievementsLeadership == undefined) {
							phdDetail.AchievementsLeadership = null;
						} else {
							phdDetail.AchievementsLeadership = $scope.AchievementsLeadership;
						}

						if ($scope.AchievementsStudentConnect == undefined) {
							phdDetail.AchievementsStudentConnect = null;
						} else {
							phdDetail.AchievementsStudentConnect = $scope.AchievementsStudentConnect;
						}


						$scope.ResearchDetail.push(phdDetail);
						console.log($scope.ResearchDetail);


					}

					$scope.ResearchReset = function () {
						$window.location.reload();
					} 

				})




//app.service('UpdatedHttpService', function ($http, $q, $rootScope) {

//    return {
//        POSTMethod: function (dict, url) {
//            if (dict == '' || dict == null) {
//                dict = {};
//            }
//            var FullUrl = url;
//            var deferred = $q.defer();
//            $http({
//                method: "POST",
//                url: FullUrl,
//                data: dict,
//                headers: {
//                    'Content-Type': 'application/json'
//                }
//            })
//             .then(function (data, status, headers, config) {

//                 deferred.resolve(data);
//             }).error(function (data, status, headers, config) {

//                 deferred.reject(data);
//             });
//            return deferred.promise;
//        },


//        GetMethod: function (method) {
//            var url = method;
//            console.log("URL MADE" + url);
//            var deferred = $q.defer();
//            $http({
//                method: "GET",
//                url: url
//            })
//             .then(function (data, status, headers, config) {
//                 deferred.resolve(data);
//             }
//             ).error(function (data, status, headers, config) {
//                 deferred.reject(data);
//             }
//             );
//            return deferred.promise;
//        },



//        POSTMethod_local: function (method, dict) {
//            console.log('dict is' + dict.UserId);

//            var url = method;

//            var deferred = $q.defer();
//            $http({
//                method: "POST",
//                url: url,
//                data: dict,
//                headers: {
//                    'Content-Type': 'application/json'
//                },
//                headers: {
//                    "Access-Control-Allow-Origin": "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//                },
//                headers: {
//                    "Access-Control-Allow-Origin": "*"
//                },
//                headers: {
//                    "Access-Control-Allow-Headers": "X-Requested-With"
//                }

//            })
//             .then(function (data, status, headers, config) {
//                 deferred.resolve(data);
//             }).error(function (data, status, headers, config) {
//                 deferred.reject(data);
//             });
//            return deferred.promise;
//        }


//    }

//});