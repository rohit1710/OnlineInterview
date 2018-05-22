using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Configuration;
using Microsoft.ApplicationBlocks.Data;
using System.Web.Script.Services;
using System.Collections;
using System.ComponentModel;
using System.IO;

/// <summary>
/// Summary description for BasicServices
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class BasicServices : System.Web.Services.WebService {

    public BasicServices () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }
    public class AppointmentCategory
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public int ID { get; set; }
    }
    public class PostApplied
    {
        public string Post { get; set; }
        public string Type { get; set; }
        public string ID { get; set; }
    }
    public class MySubject
    {
        public string subject { get; set; }
    }    
    public class City
    {
        public string city { get; set; }
    }
    public class MediaRefrence 
    {
        public string Content { get; set; }
        public string ID { get; set; }
    }
    public class GetAllDegree
    {
        public string Degree { get; set; }
    }
    public class GetAllPgDegree
    {
        public string Degree { get; set; }
    }
    public class SubjectStream
    {
        public string subject { get; set; }
        public string ID { get; set; }
    }
    public class DistrictStateCountry
    {
        public string District { get; set; }
        public string State { get; set; }
        public string Country { get; set; }

    }
    public class GetAllBasicData
    {
        public List<AppointmentCategory> AppointmentCategoryList { get; set; }
        public List<MySubject> MySubjectList { get; set; }
        public List<City> MyCityList { get; set; }
        public List<MediaRefrence> MdRefrence { get; set; }
        public List<GetAllDegree> MyDegree { get; set; }
        public List<GetAllPgDegree> MyPgDegree { get; set; }

        //public List<SubjectStream> MySubjectStream = new List<SubjectStream>();
    }    

    [WebMethod]
    public void GetAllBasicDataFunction() //void
    {
        GetAllBasicData ob = new GetAllBasicData();

        List<AppointmentCategory> Appointments = new List<AppointmentCategory>();
        List<MySubject> Subjects = new List<MySubject>();
        List<City> Cities = new List<City>();
        List<MediaRefrence> Reference = new List<MediaRefrence>();
        List<GetAllDegree> Degrees = new List<GetAllDegree>();
        List<GetAllPgDegree> PgDegree = new List<GetAllPgDegree>();
        //List<SubjectStream> SubStream = new List<SubjectStream>();
        
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            con.Open();
            //string qry = "SELECT [Type], [Category], [ID] FROM [OnlineJobCategory] SELECT DISTINCT Subject FROM [OnlineJobSubjectMaster] ORDER BY [Subject] SELECT  CityName FROM dbo.CityMaster WHERE Active=1  ORDER BY CityName select ID,Contents from OnlineJobReferencemaster where Status='True' order by contents SELECT Degree FROM dbo.OnlineJobDegreeMaster  WHERE ExamType='Graduation' AND IsActive=1 ORDER BY Degree SELECT Degree FROM dbo.OnlineJobDegreeMaster  WHERE ExamType='P.G' AND IsActive=1 ORDER BY Degree  select Distinct Subject,ID from SubjectPreferenceMaster where subject is not NULL  order By Subject";

            SqlParameter[] prm = new SqlParameter[1];
            prm[0]=new SqlParameter("@Type","BasicDetail");

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            foreach(DataRow dr in ds.Tables[0].Rows)
            {
                AppointmentCategory apt = new AppointmentCategory();
                apt.ID = Convert.ToInt32(dr["ID"].ToString());
                apt.Category = dr["Category"].ToString();
                apt.Type = dr["Type"].ToString();
                Appointments.Add(apt);
            }
            ob.AppointmentCategoryList = Appointments;

            foreach(DataRow dr in ds.Tables[1].Rows)
            {
                MySubject sbjct = new MySubject();
                sbjct.subject = dr["Subject"].ToString();
                Subjects.Add(sbjct);
            }
            ob.MySubjectList = Subjects;

            foreach(DataRow dr in ds.Tables[2].Rows)
            {
                City ct = new City();
                ct.city = dr["CityName"].ToString();
                Cities.Add(ct);
            }
            ob.MyCityList = Cities;

            foreach(DataRow dr in ds.Tables[3].Rows)
            {
                MediaRefrence mrf = new MediaRefrence();
                mrf.ID = dr["ID"].ToString();
                mrf.Content = dr["Contents"].ToString();
                Reference.Add(mrf);
            }
            ob.MdRefrence = Reference;

            foreach(DataRow dr in ds.Tables[4].Rows)
            {
                GetAllDegree dg = new GetAllDegree();
                dg.Degree = dr["Degree"].ToString();
                Degrees.Add(dg);
            }
            ob.MyDegree = Degrees;

            foreach (DataRow dr in ds.Tables[5].Rows)
            {
                GetAllPgDegree pdg = new GetAllPgDegree();
                pdg.Degree = dr["Degree"].ToString();
                PgDegree.Add(pdg);
            }
            ob.MyPgDegree = PgDegree;

            JavaScriptSerializer js = new JavaScriptSerializer();    // void
            Context.Response.Write(js.Serialize(ob));
        }
        //return ob;
    }
    
    [WebMethod]
    public PostApplied[] GetPost(string type)
    {
        List<PostApplied> PostList = new List<PostApplied>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            con.Open();
            //string qry = "SELECT [Post],[Type],[ID] FROM [OnlineJobPostMaster] WHERE ([Type] = '"+type+"')  ORDER BY Post";

            SqlParameter[] prm = new SqlParameter[2];
            prm[0] = new SqlParameter("@Posttype", type);
            prm[1]=new SqlParameter("@Type","GetPost");

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                PostApplied pa = new PostApplied();
                pa.Post = dr["Post"].ToString();
                pa.Type = dr["Type"].ToString();
                pa.ID = dr["ID"].ToString();
                PostList.Add(pa);
            }


            return PostList.ToArray();
            //JavaScriptSerializer js = new JavaScriptSerializer();
            //Context.Response.Write(js.Serialize(PostList));
        }
    }

    [WebMethod]
    public DistrictStateCountry[] getDistrictStateCountry(string City)
    {
        List<DistrictStateCountry> DistrictStateCountryList = new List<DistrictStateCountry>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            con.Open();
            SqlParameter[] prm = new SqlParameter[2];
            prm[0] = new SqlParameter("@City", City);
            prm[1] = new SqlParameter("@Type", "getDistrictStateCountry");
            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                DistrictStateCountry DSC = new DistrictStateCountry();
                DSC.District = dr["District"].ToString();
                DSC.State = dr["State"].ToString();
                DSC.Country = dr["Country"].ToString();
                DistrictStateCountryList.Add(DSC);
            }
            return DistrictStateCountryList.ToArray();            
        }
    }

    [WebMethod]
    public void GetSubjectStream() 
    {
        List<SubjectStream> SubjectStreamList = new List<SubjectStream>();        
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            con.Open();
            SqlParameter[] prm = new SqlParameter[1];
            prm[0] = new SqlParameter("@Type", "SubjectStream");

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                SubjectStream ss = new SubjectStream();
                ss.subject = dr["Subject"].ToString();
                ss.ID = dr["ID"].ToString();
                SubjectStreamList.Add(ss);
            }
            JavaScriptSerializer js = new JavaScriptSerializer();    // void
            Context.Response.Write(js.Serialize(SubjectStreamList));
            //return SubjectStreamList.ToArray();            
        }
    }
    public class Subjects 
    {
        public string course { get; set; }
    }

    [WebMethod]
    public Subjects[] getSubjects(string Subjectid) 
    {
        List<Subjects> mySub=new List<Subjects>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            con.Open();
            //string qry = "select CourseTitle from SubjectPreferenceMaster where ID='" + Subjectid + "'  "and isactive=1

            SqlParameter[] prm = new SqlParameter[2];
            prm[0] = new SqlParameter("@Type", "getSubjects");
            prm[1] = new SqlParameter("@Subjectid", Subjectid);

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

           
            foreach(DataRow dr in ds.Tables[0].Rows)
            {
                Subjects sub = new Subjects();
                sub.course = dr["CourseTitle"].ToString();
                mySub.Add(sub);
            }
            return mySub.ToArray();
        }
    }
     
    public class Search
    {
        public string AppID{get; set;}
        public string DOB{get; set;}
    }

    [WebMethod]
    public Search[] SearchAppID(string name, string dob, string email, string mblno)
    {
        List<Search> srch = new List<Search>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            SqlParameter[] prm = new SqlParameter[5];
            prm[0] = new SqlParameter("@Type", "Search");
            prm[1] = new SqlParameter("@Name", name);
            prm[2] = new SqlParameter("@DOB", dob);
            prm[3] = new SqlParameter("@Email", email);
            prm[4] = new SqlParameter("@MobileNumber", mblno);

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            foreach (DataRow dr in ds.Tables[0].Rows) 
            {
                Search sr = new Search();
                sr.AppID = dr["ApplicationID"].ToString();
                sr.DOB = dr["DateOfBirth"].ToString();
                srch.Add(sr);
            }
            return srch.ToArray();
        }
    }

    public class login
    {
       public string ApplicationId { get; set; }
       public string status { get; set; }
       public string DOI { get; set; }
       public string Appeared { get; set; }
    }

    [WebMethod(EnableSession=true)]    
    public login[] getLogin( string ApplicationId, string DOB) 
    {
        List<login> lgn = new List<login>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        using (SqlConnection con = new SqlConnection(constr))
        {
            SqlParameter[] prm = new SqlParameter[3];
            prm[0] = new SqlParameter("@Type", "Login");
            prm[1] = new SqlParameter("@AppId", ApplicationId);
            prm[2] = new SqlParameter("@DOB", DOB);

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            if (ds.Tables[0].Rows.Count > 0) 
            {
                foreach (DataRow dr in ds.Tables[0].Rows) 
                {
                    if (dr["Status"].ToString() == "True" || (!string.IsNullOrEmpty(dr["DOI"].ToString())))
                    { }
                    else
                    {
                        if(!string.IsNullOrEmpty(dr["ApplicationID"].ToString()))
                        {
                            HttpContext.Current.Session["ApplicationId"] = dr["ApplicationID"].ToString();
                        }
                    }
                    login lg = new login();
                    lg.ApplicationId = dr["ApplicationId"].ToString();
                    lg.status = dr["Status"].ToString();
                    lg.DOI = dr["DOI"].ToString();
                    lg.Appeared = dr["Appeared"].ToString();
                    lgn.Add(lg);
                }
            }
            return lgn.ToArray();
        }
    }

    //string category,string PostApplied,string AreaOfSpecialization,string Qualification,string subject,string OtherSubj,
    //string ttl,string name, string fname,string mname ,string casteCategory,string DOB, string nationality, string mstatus, string address,string town,string district,
    //string state,string country,string zip, string contact,string Aadhar,string PAN,
    //string expTY, string expTM, string expRY, string expRM, string expIY, string expIM,
    //,string LpuWorking,string xUid,string xDept, string xStartDate,string xEndDate,
    //string alumni,string xReg,string xProg, string xSDate,string xEDate,
    [WebMethod(EnableSession=true)]
    public string SaveRegistarionDetail(         
            List<ProfessionalProfile> pp,
            List<PersonalContact> pc,         
            List<EducationObject> eduList, string PhdTitle, string DOA,
            List<ExperinceDuration> ed, List<ExperienceObject> expList,            
            string WayOfResp,string OtherWayOfResp,        
            List<ExLpu> xemp,
            List<Alumni> alm,
            string LpuRef,string RefUid,string RefName,
            string WaytoRespond ,
            string ApplicationId
        )
    {
        string Application_id = "";
         string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
         using (SqlConnection con = new SqlConnection(constr))
         {
             SqlParameter[] prm = new SqlParameter[17];

             // professional profile detail

             DataTable ProfessionalProfileTable = new DataTable();
             ProfessionalProfileTable = ListExtensions.ToDataTable(pp);
             ProfessionalProfileTable.TableName = "Professional";
             string ProfessionalProfileXML = CreateXml(ProfessionalProfileTable);
             prm[0] = new SqlParameter("@ProfessionalProfileXML", ProfessionalProfileXML);

             // personal contact detail

             DataTable PersonalContactTable = new DataTable();
             PersonalContactTable = ListExtensions.ToDataTable(pc);
             PersonalContactTable.TableName = "Personal";
             string PersonalContactXML = CreateXml(PersonalContactTable);
             prm[1] = new SqlParameter("@PersonalContactXML", PersonalContactXML);

             
             // education detail            

             DataTable educationTable = new DataTable();             
             educationTable = ListExtensions.ToDataTable(eduList);
             educationTable.TableName = "Education";
             string EducationXML = CreateXml(educationTable);            

             prm[2]=new SqlParameter("@EducationDetailXML",EducationXML);
             prm[3]=new SqlParameter("@PhdTitle",PhdTitle);
             prm[4]=new SqlParameter("@DOA",DOA);

             // experice detail

             string ExperienceXML="";
             if (expList.Count>0)
             {
                 DataTable experienceTable = new DataTable();                 
                 experienceTable = ListExtensions.ToDataTable(expList);
                 experienceTable.TableName = "Experience";
                 ExperienceXML = CreateXml(experienceTable);                    
             }
             
             prm[5] = new SqlParameter("@ExpDetailXML", ExperienceXML);
             
            
             DataTable experienceDurationTable = new DataTable();
             experienceDurationTable = ListExtensions.ToDataTable(ed);
             experienceDurationTable.TableName = "ExperienceDuration";
             string ExperienceDurationXML = CreateXml(experienceDurationTable);
             
             prm[6] = new SqlParameter("@ExpDurationXML", ExperienceDurationXML);                          

             //way of respond media
             prm[7] = new SqlParameter("@WayOfResp", WayOfResp);
             prm[8] = new SqlParameter("@OtherWayOfResp", OtherWayOfResp);

             // Lpu Working
             DataTable ExLpuTable = new DataTable();
             ExLpuTable = ListExtensions.ToDataTable(xemp);
             ExLpuTable.TableName = "LpuWorking";
             string ExLpuXML = CreateXml(ExLpuTable);

             prm[9] = new SqlParameter("@ExLpuXML", ExLpuXML);

             // Lpu Alumni

             DataTable AlumniTable = new DataTable();
             AlumniTable = ListExtensions.ToDataTable(alm);
             AlumniTable.TableName = "Alumni";
             string AlumniXML = CreateXml(AlumniTable);

             prm[10] = new SqlParameter("@AlumniXML", AlumniXML);            

             // Lpu Reference
             prm[11] = new SqlParameter("@LpuRef", LpuRef);
             prm[12] = new SqlParameter("@RefUid", RefUid);
             prm[13] = new SqlParameter("@RefName", RefName);

             // Way to Respond
             prm[14]=new SqlParameter("@WaytoRespond",WaytoRespond);

             prm[15] = new SqlParameter("@Type", "SaveRegistartionDetail");

             if (string.IsNullOrEmpty(ApplicationId) || ApplicationId == "null")
             {
                 prm[16] = new SqlParameter("@AppId", DBNull.Value);
             }
             else
             {
                 prm[16] = new SqlParameter("@AppId", ApplicationId);
             }            
             

             Application_id = SqlHelper.ExecuteScalar(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm).ToString();

             if (!string.IsNullOrEmpty(Application_id))
             {                 
                 HttpContext.Current.Session["ApplicationId"] = Application_id;
             }
             else {
                 HttpContext.Current.Session["ApplicationId"] = "";
             }

         }
        return Application_id;
    }
    [WebMethod(EnableSession = true)]
    public string SaveOtherDetail(string SessionAppId,string ResearchActivity, string Participation, string Talents, string LSpeak, string LRead, string LWrite,
                                   List<ReferenceDetail> refList,List<FamilyDetail> famList,List<HealthDetail> healthList,List<HabitDetail> habitList
    ) 
    {
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        string category = "";
        using (SqlConnection con = new SqlConnection(constr))

        {
            SqlParameter[] prm = new SqlParameter[12];

            prm[0]=new SqlParameter("@ResearchActivity",ResearchActivity);
            prm[1]=new SqlParameter("@Participation",Participation);
            prm[2]=new SqlParameter("@Talents",Talents);
            prm[3]=new SqlParameter("@LSpeak",LSpeak);
            prm[4]=new SqlParameter("@LRead",LRead);
            prm[5]=new SqlParameter("@LWrite",LWrite);


            if (refList.Count > 0) {
                DataTable referenceTable = new DataTable();
                referenceTable = ListExtensions.ToDataTable(refList);
                referenceTable.TableName = "Reference";
                string ReferenceXML = CreateXml(referenceTable);
                prm[6] = new SqlParameter("@ReferenceDetailXML", ReferenceXML);
            }
            else
            {
                prm[6] = new SqlParameter("@ReferenceDetailXML", DBNull.Value);
            }


            if (famList.Count > 0) {
                DataTable familyTable = new DataTable();
                familyTable = ListExtensions.ToDataTable(famList);
                familyTable.TableName = "Family";
                string FamilyXML = CreateXml(familyTable);
                prm[7] = new SqlParameter("@FamilyDetailXML", FamilyXML);
            }
            else
            {
                prm[7] = new SqlParameter("@FamilyDetailXML", DBNull.Value);
            }
            
            DataTable healthTable = new DataTable();            
            healthTable = ListExtensions.ToDataTable(healthList);
            healthTable.TableName = "Health";
            string HealthXML = CreateXml(healthTable);
            prm[8]=new SqlParameter("@HealthDetailXML",HealthXML);
            
            DataTable habitTable = new DataTable();            
            habitTable = ListExtensions.ToDataTable(habitList);
            habitTable.TableName = "Habit";
            string HabitXML = CreateXml(habitTable); 
            prm[9] = new SqlParameter("@HabitDetailXML", HabitXML);

            prm[10] = new SqlParameter("@Type", "SaveOtherDetail");
            if (string.IsNullOrEmpty(SessionAppId))
            {
                prm[11] = new SqlParameter("@AppId", DBNull.Value);
            }
            else
            {
                prm[11] = new SqlParameter("@AppId", SessionAppId);
            }
            

            category = SqlHelper.ExecuteScalar(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm).ToString();

        }

        return category;
    }

    [WebMethod(EnableSession = true)]
    public string SaveSubjectPreference(string AppID,string MainSubId,List<PreferenceDetail> prefDetail)
    {
         string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
         string result = "";
         using (SqlConnection con = new SqlConnection(constr))
         {
             SqlParameter[] prm = new SqlParameter[4];

             prm[0]=new SqlParameter("@AppID",AppID);
             prm[1]=new SqlParameter("@MainSubjectId",MainSubId);

             DataTable PreferenceTable = new DataTable();            
             PreferenceTable = ListExtensions.ToDataTable(prefDetail);
             PreferenceTable.TableName = "Preference";
             string preferenceXML = CreateXml(PreferenceTable);

             prm[2] = new SqlParameter("@SubPreferenceXML", preferenceXML);
             prm[3] = new SqlParameter("@Type", "SaveSubjectPreference");

             result = SqlHelper.ExecuteScalar(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm).ToString();
             
         }
        return result;
    }

    [WebMethod(EnableSession = true)]
    public string saveResearchDetail(string AppID,List<ResearchDetail> rsd) 
    {
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        string result = "";
        using (SqlConnection con = new SqlConnection(constr))
        {
            SqlParameter[] prm = new SqlParameter[3];

            prm[0] = new SqlParameter("@AppID", AppID);
            prm[1] = new SqlParameter("@Type", "SaveResearchDetail");

            DataTable ResearchTable = new DataTable();
            ResearchTable = ListExtensions.ToDataTable(rsd);
            ResearchTable.TableName = "Research";
            string ResearchXML = CreateXml(ResearchTable);

            prm[2] = new SqlParameter("@ResearchDetailXML", ResearchXML);

            result = SqlHelper.ExecuteScalar(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm).ToString();

        }
        return result;
    }





    [WebMethod(EnableSession = true)]
    public string Password(string AppID,string pwd, string cpwd,string sub)
    {
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
        string s="";
        using (SqlConnection con = new SqlConnection(constr))
        {
            SqlParameter[] prm = new SqlParameter[6];

            prm[0] = new SqlParameter("@AppID", AppID);
            prm[1] = new SqlParameter("@pwd", pwd);
            prm[2] = new SqlParameter("@cpwd", cpwd);
            prm[3] = new SqlParameter("@Type", "SavePasswordDetail");
            prm[4] = new SqlParameter("@Sub", sub);

            s = SqlHelper.ExecuteScalar(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm).ToString();
            if (string.IsNullOrEmpty(s))
            {
                s = "error";
            }
            else
            { s = "success"; }
        }
        return s;
    }
     

    [WebMethod(EnableSession=true)]
    public getSavedRegistrationDataObject getSavedRegistarionData(string AppID)
    {
        getSavedRegistrationDataObject obj = new getSavedRegistrationDataObject();
        List<getSavedRegistrationData> savedData = new List<getSavedRegistrationData>();
        List<EducationObject> EducationData = new List<EducationObject>();
        List<ExperienceObject> Exp = new List<ExperienceObject>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();        
        string s="";
        using (SqlConnection con = new SqlConnection(constr))
        {
            SqlParameter[] prm = new SqlParameter[2];

            prm[0] = new SqlParameter("@AppID", AppID);
            prm[1] = new SqlParameter("@Type", "GetSavedRegistarionData");

            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            foreach(DataRow dr in ds.Tables[0].Rows)
            {
                getSavedRegistrationData gsrd = new getSavedRegistrationData();
                gsrd.AppoinmentCategory =dr["AppoinmentCategory"].ToString();
                gsrd.PostApplied = dr["PostApplied"].ToString();
                gsrd.AreaOfSpecilization = dr["AreaOfSpecilization"].ToString();
                gsrd.Qualification = dr["Qualification"].ToString();
                gsrd.Subject = dr["Subject"].ToString();
                gsrd.OtherSubject = dr["OtherSubject"].ToString();
                gsrd.RegNo = dr["RegNo"].ToString();
                gsrd.Title = dr["Title"].ToString();
                gsrd.Name = dr["Name"].ToString();
                gsrd.FatherName = dr["FatherName"].ToString();
                gsrd.MotherName = dr["MotherName"].ToString();
                gsrd.Category = dr["Category"].ToString();
                gsrd.DateOfBirth = dr["DateOfBirth"].ToString();
                gsrd.Nationality = dr["Nationality"].ToString();
                gsrd.MaritalStatus = dr["MaritalStatus"].ToString();
                gsrd.Address = dr["Address"].ToString();
                gsrd.City = dr["City"].ToString();
                gsrd.District = dr["District"].ToString();
                gsrd.State = dr["State"].ToString();
                gsrd.Country = dr["Country"].ToString();
                gsrd.PinCode = dr["PinCode"].ToString();
                gsrd.MobileNumber = dr["MobileNumber"].ToString();
                gsrd.Email = dr["Email"].ToString();
                gsrd.AadhaarNo = dr["AadhaarNo"].ToString();
                gsrd.PanCardNo = dr["PanCardNo"].ToString();
                gsrd.PhdTitle = dr["PhdTitle"].ToString();
                gsrd.DateOfAward = dr["DateOfAward"].ToString();
                gsrd.ExpTeaching = dr["ExpTeaching"].ToString();
                gsrd.ExpTeachMonths = dr["ExpTeachMonths"].ToString();
                gsrd.ExpResearch = dr["ExpResearch"].ToString();
                gsrd.ExpResearchMonths = dr["ExpResearchMonths"].ToString();
                gsrd.ExpIndustry = dr["ExpIndustry"].ToString();
                gsrd.ExpIndusMonths = dr["ExpIndusMonths"].ToString();
                gsrd.Reference = dr["Reference"].ToString();
                gsrd.OtherReference = dr["OtherReference"].ToString();
                gsrd.WorkAtLPU = dr["WorkAtLPU"].ToString();
                gsrd.EmpCode = dr["EmpCode"].ToString();
                gsrd.LPUDept = dr["LPUDept"].ToString();
                gsrd.StartsFrom = dr["StartsFrom"].ToString();
                gsrd.EndTo = dr["EndTo"].ToString();
                gsrd.StudiedAtLPU = dr["StudiedAtLPU"].ToString();
                gsrd.Regnumber = dr["Regnumber"].ToString();
                gsrd.studentProgram = dr["studentProgram"].ToString();
                gsrd.StudyFrom = dr["StudyFrom"].ToString();
                gsrd.Studyto = dr["Studyto"].ToString();
                gsrd.LPUReference = dr["LPUReference"].ToString();
                gsrd.LPUReferenceCode = dr["LPUReferenceCode"].ToString();
                gsrd.LPUReferenceName = dr["LPUReferenceName"].ToString();
                gsrd.SourceOfResponse = dr["SourceOfResponse"].ToString();
                savedData.Add(gsrd);
            }
            obj.RegData = savedData;

            foreach (DataRow dr in ds.Tables[1].Rows)
            {
                EducationObject edo = new EducationObject();
                edo.EducationDOCM = dr["CourseMonth"].ToString();
                edo.EducationDOCY = dr["CourseYear"].ToString();
                edo.EducationExam = dr["ExamType"].ToString();
                edo.EducationMarks = dr["PercentageMarks"].ToString();
                edo.EducationMode = dr["ModeOfEducation"].ToString();
                edo.EducationStatus = dr["Status"].ToString();
                edo.EducationYOP = dr["YearOfPassing"].ToString();
                edo.EducationdCollege = dr["CollegeName"].ToString();
                edo.EducationdDegree = dr["Degree"].ToString();
                edo.EducationdSubject = dr["MainSubject"].ToString();
                edo.EducationdUni = dr["UniversityName"].ToString();
                EducationData.Add(edo);
            }
            obj.EDO = EducationData;

            if (ds.Tables.Count == 3) 
            {
                foreach (DataRow dr in ds.Tables[2].Rows) 
                {
                    ExperienceObject exp = new ExperienceObject();
                    exp.University = dr["OrganizationPlaceOfPosting"].ToString();
                    exp.Designation = dr["Designation"].ToString();
                    exp.StartDate = dr["ServiceFrom"].ToString();
                    exp.EndDate = dr["ServiceTo"].ToString();
                    exp.Salary = dr["Salary"].ToString();
                    exp.Reason = dr["ReasonForLeaving"].ToString();
                    Exp.Add(exp);
                }
                obj.ExpData = Exp;
            }

        }
        return obj;
    }

    [WebMethod(EnableSession = true)]
    public getSavedOtherDataObject getSavedOtherDetail(string AppID) 
    {
        getSavedOtherDataObject obj = new getSavedOtherDataObject();
        List<getSavedOtherData> otherdata = new List<getSavedOtherData>();
        List<HealthDetail> Health = new List<HealthDetail>();
        List<HabitDetail> Habit = new List<HabitDetail>();
        List<ReferenceDetail> Reference = new List<ReferenceDetail>();
        List<FamilyDetail> Family = new List<FamilyDetail>();
        string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();                
        using (SqlConnection con = new SqlConnection(constr))
        {
            SqlParameter[] prm = new SqlParameter[2];
            prm[0] = new SqlParameter("@Type", "GetSavedOtherDetail");
            prm[1] = new SqlParameter("@AppId", AppID);
            DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

            foreach (DataRow dr in ds.Tables[0].Rows) {
                getSavedOtherData gsod = new getSavedOtherData();
                HealthDetail hlt = new HealthDetail();
                HabitDetail hbt = new HabitDetail();
                gsod.ResearchActivity = dr["ResearchActivities"].ToString();
                gsod.Participation = dr["Participation"].ToString();
                gsod.Talents = dr["Talents"].ToString();
                gsod.LanguageSpeak = dr["LanguageCanSpeak"].ToString();
                gsod.LanguageRead = dr["LanguageCanRead"].ToString();
                gsod.LanguageWrite = dr["LanguageCanRead"].ToString();
                otherdata.Add(gsod);
                
                hlt.BloodGroup = dr["BloodGroup"].ToString();
                hlt.Height = dr["Height"].ToString();
                hlt.Weight = dr["Weight"].ToString();
                hlt.Ey = dr["EyeSight"].ToString();
                hlt.CDiseas = dr["AnyChronicDisease"].ToString();
                hlt.Ent = dr["AnyENTProblem"].ToString();
                hlt.Phy = dr["AnyPhysicalHandicap"].ToString();
                hlt.Alr = dr["AnyTypeOfAllergy"].ToString();
                Health.Add(hlt);

                hbt.Smoking = dr["HabitOfSmoking"].ToString();
                hbt.Alcohal = dr["UseOfAlchohol"].ToString();
                hbt.Tobacco = dr["ChewingOfTobaccoGutka"].ToString();
                hbt.Other = dr["AnyOtherSpecify"].ToString();
                Habit.Add(hbt);
            }
            obj.SOD = otherdata;
            obj.HEA = Health;
            obj.HAB = Habit;
           
            if (ds.Tables.Count >= 2) {
                foreach (DataRow dr in ds.Tables[1].Rows) {
                    FamilyDetail fd = new FamilyDetail();
                    fd.Name = dr["Name"].ToString();
                    fd.Relation = dr["RelationShip"].ToString();
                    fd.Age = dr["Age"].ToString();
                    fd.Qualification = dr["Qualification"].ToString();
                    fd.Profession = dr["Profession"].ToString();
                    fd.Organization = dr["PlaceOfWork"].ToString();
                    fd.Contact = dr["MobileNo"].ToString();
                    fd.Email= dr["EmailID"].ToString();
                    Family.Add(fd);
                }
                obj.FAM = Family;
            }

            if (ds.Tables.Count > 2) { 
                foreach(DataRow dr in ds.Tables[2].Rows)
                {                    
                    ReferenceDetail rd = new ReferenceDetail();
                    rd.Name = dr["Name"].ToString();
                    rd.Occupation = dr["Occupation"].ToString();
                    rd.Address = dr["Address"].ToString();
                    rd.KnownSince = dr["KnownSince"].ToString();
                    rd.Contact = dr["MobileNo"].ToString();
                    rd.Email = dr["Email"].ToString();
                    Reference.Add(rd);
                }
                obj.REF = Reference;
            }

        }
        return obj;
    }

    [WebMethod(EnableSession = true)]
    public PreferenceDetail[] getSavedSubjectPreference(string AppID)
    {
        List<PreferenceDetail> pref = new List<PreferenceDetail>();
         string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
         using (SqlConnection con = new SqlConnection(constr))
         {
             SqlParameter[] prm = new SqlParameter[2];
             prm[0] = new SqlParameter("@Type", "GetSavedSubjectPref");
             prm[1] = new SqlParameter("@AppId", AppID);
             DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);

             if (ds.Tables.Count > 0) {
                 if (ds.Tables[0].Rows.Count > 0) {
                     foreach (DataRow dr in ds.Tables[0].Rows) {
                         PreferenceDetail pd = new PreferenceDetail();
                         pd.MainSubject = dr["SubID"].ToString();
                         pd.Subject = dr["Subject_Name"].ToString();
                         pd.Reason = dr["Reason"].ToString();
                         pd.OtherReason = dr["AnyOther"].ToString();
                         pd.Experience = dr["Experience"].ToString();
                         pref.Add(pd);
                     }
                 }
             }
         }
        return pref.ToArray();
    }

    [WebMethod(EnableSession = true)]
    public ArchiAndPharma[] GetArchiAndPharmaCheck(string sub) 
    {
        List<ArchiAndPharma> RegName = new List<ArchiAndPharma>();
         string constr = ConfigurationManager.ConnectionStrings["NewUMSConnectionString"].ConnectionString.ToString();
         using (SqlConnection con = new SqlConnection(constr))
         {
             SqlParameter[] prm = new SqlParameter[2];
             prm[0] = new SqlParameter("@Type", "GetArchiAndPharmaCheck");
             prm[1] = new SqlParameter("@Sub", sub);
             DataSet ds = SqlHelper.ExecuteDataset(con, CommandType.StoredProcedure, "pOnlineTestProcessForInterview", prm);
             if (ds.Tables.Count > 0) {
                 foreach (DataRow dr in ds.Tables[0].Rows) {
                     ArchiAndPharma ap = new ArchiAndPharma();
                     ap.RegNo = dr["RegName"].ToString();
                     RegName.Add(ap);
                 }
             }
         }
         return RegName.ToArray();
    }

    public class getSavedOtherDataObject
    {
        public List<getSavedOtherData> SOD { get; set; }
        public List<ReferenceDetail> REF { get; set; }
        public List<FamilyDetail> FAM { get; set; }
        public List<HealthDetail> HEA { get; set; }
        public List<HabitDetail> HAB { get; set; }
    }

    public class getSavedRegistrationData {
        public string AppoinmentCategory { get; set; }
        public string PostApplied { get; set; }
        public string AreaOfSpecilization { get; set; }
        public string Qualification { get; set; }
        public string Subject { get; set; }
        public string OtherSubject { get; set; }
        public string RegNo { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public string Category { get; set; }
        public string DateOfBirth { get; set; }
        public string Nationality { get; set; }
        public string MaritalStatus { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PinCode { get; set; }
        public string MobileNumber { get; set; }
        public string Email { get; set; }
        public string AadhaarNo { get; set; }
        public string PanCardNo { get; set; }
        public string PhdTitle { get; set; }
        public string DateOfAward { get; set; }
        public string ExpTeaching { get; set; }
        public string ExpTeachMonths { get; set; }
        public string ExpResearch { get; set; }
        public string ExpResearchMonths { get; set; }
        public string ExpIndustry { get; set; }
        public string ExpIndusMonths { get; set; }
        public string Reference { get; set; }
        public string OtherReference { get; set; }
        public string WorkAtLPU { get; set; }
        public string EmpCode { get; set; }
        public string LPUDept { get; set; }
        public string StartsFrom { get; set; }
        public string EndTo { get; set; }
        public string StudiedAtLPU { get; set; }
        public string Regnumber { get; set; }
        public string studentProgram { get; set; }
        public string StudyFrom { get; set; }
        public string Studyto { get; set; }
        public string LPUReference { get; set; }
        public string LPUReferenceCode { get; set; }
        public string LPUReferenceName { get; set; }
        public string SourceOfResponse { get; set; }
    }

    public class getSavedOtherData 
    {
        public string ResearchActivity { get; set; }
        public string Participation { get; set; }
        public string Talents { get; set; }
        public string LanguageSpeak { get; set; }
        public string LanguageRead { get; set; }
        public string LanguageWrite { get; set; }

    }
    
    public class getSavedRegistrationDataObject {

        public List<EducationObject> EDO { get; set; }
        public List<getSavedRegistrationData> RegData { get; set; }
        public List<ExperienceObject> ExpData { get; set; }
        
    }
    public string CreateXml(DataTable dt) {
        string xml = "";
        StringWriter sw = new StringWriter();
        dt.WriteXml(sw);
        xml = sw.ToString();
        return xml;
    }
    public class ProfessionalProfile {
        public string AppointmentCategory { get; set; }
        public string AreaOfSpecialization { get; set; }
        public object OtherSubject { get; set; }
        public string PostApplied { get; set; }
        public string Qualification { get; set; }
        public string Subject { get; set; }
        public string RegistrationNumber { get; set; } // PCI or COA registration number
    }
    public class PersonalContact {
        public string Aadharno { get; set; }
        public string Country { get; set; }
        public string District { get; set; }
        public string PDOB { get; set; }
        public string PanNo { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
        public string TownCity { get; set; }
        public string Ttl { get; set; }
        public string address { get; set; }
        public string castcategory { get; set; }
        public string fname { get; set; }
        public string marital { get; set; }
        public string mblNo { get; set; }
        public string mname { get; set; }
        public string name { get; set; }
        public string national { get; set; }
        public string email { get; set; }
        
    }
    public class ExperinceDuration {
        public string ExperienceIM { get; set; }
        public string ExperienceIY { get; set; }
        public string ExperienceRM { get; set; }
        public string ExperienceRY { get; set; }
        public string ExperienceTM { get; set; }
        public string ExperienceTY { get; set; }
    }
    public class ExperienceObject
    {
        public string University { get; set; }
        public string Designation { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Salary { get; set; }
        public string Reason { get; set; }
    }
    public class EducationObject 
    {
        public string EducationDOCM { get; set; }
        public string EducationDOCY { get; set; }
        public string EducationExam { get; set; }
        public string EducationMarks { get; set; }
        public string EducationMode { get; set; }
        public string EducationStatus { get; set; }
        public string EducationYOP { get; set; }
        public string EducationdCollege { get; set; }
        public string EducationdDegree { get; set; }
        public string EducationdSubject { get; set; }
        public string EducationdUni { get; set; }
    }
    public class ExLpu {
        public string XLpuEndDate { get; set; }
        public string xLpu { get; set; }
        public string xLpuDept { get; set; }
        public string xLpuStartDate { get; set; }
        public string xLpuUID { get; set; }
    }
    public class Alumni
    {
        public string AlimniEndDate { get; set; }
        public string AlumniProgram { get; set; }
        public string AlumniRegNo { get; set; }
        public string AlumniStart { get; set; }
        public string isAlumni { get; set; }
    }
    public class ReferenceDetail {
        public string Address { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string KnownSince { get; set; }
        public string Name { get; set; }
        public string Occupation { get; set; }
    }
    public class FamilyDetail
    {
        public string Age { get; set; }
        public string Contact { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Organization { get; set; }
        public string Profession { get; set; }
        public string Qualification { get; set; }
        public string Relation { get; set; }
    }
    public class HealthDetail {
        public string Alr { get; set; }
        public string BloodGroup { get; set; }
        public string CDiseas { get; set; }
        public string Ent { get; set; }
        public string Ey { get; set; }
        public string Height { get; set; }
        public string Phy { get; set; }
        public string Weight { get; set; }
    }
    public class HabitDetail {
        public string Alcohal { get; set; }
        public string Other { get; set; }
        public string Smoking { get; set; }
        public string Tobacco { get; set; }
    }
    public class PreferenceDetail {
        public string Experience { get; set; }
        public object OtherReason { get; set; }
        public string Reason { get; set; }
        public string Subject { get; set; }
        public string Preference { get; set; }
        public string MainSubject { get; set; }
    }

    public class ArchiAndPharma {
        public string RegNo { get; set; }
    }

    public class ResearchDetail { 
        public string JournalScopus { get; set; }
        public string JournalWos { get; set; }
        public string ConferencesPublication { get; set; }
        public string AnyExternalGrant { get; set; }
        public string GrantApplied { get; set; }
        public string PatentGranted { get; set; }
        public string PatentFilled { get; set; }
        public string PatentApproved { get; set; }
        public string Copyright { get; set; }
        public string BookPublished { get; set; }
        public string OrganizedConferenceRole { get; set; }
        public string PhdSupervised { get; set; }
        public string PhdSupervising { get; set; }
        public string MphilSupervised { get; set; }
        public string MphilSupervising { get; set; }
        public string TravelledAbroad { get; set; }
        public string Hindex { get; set; }
        public string I10index { get; set; }
        public string CountriesVisited { get; set; }
        public string VisitedCountriesName { get; set; }
        public string AcademicsAchievements { get; set; }
        public string ResearchAchievements { get; set; }
        public string IndustryEngagementAchievements { get; set; }
        public string LeadershipAchievements { get; set; }
        public string StudentConnectAchievements { get; set; }
    }
}



public static class ListExtensions
{
    public static DataTable ToDataTable<T>(this List<T> iList)
    {
        DataTable dataTable = new DataTable();
        PropertyDescriptorCollection propertyDescriptorCollection = TypeDescriptor.GetProperties(typeof(T));
        for (int i = 0; i < propertyDescriptorCollection.Count; i++)
        {
            PropertyDescriptor propertyDescriptor = propertyDescriptorCollection[i];
            Type type = propertyDescriptor.PropertyType;

            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                type = Nullable.GetUnderlyingType(type);

            dataTable.Columns.Add(propertyDescriptor.Name, type);
        }
        object[] values = new object[propertyDescriptorCollection.Count];
        foreach (T iListItem in iList)
        {
            for (int i = 0; i < values.Length; i++)
            {
                values[i] = propertyDescriptorCollection[i].GetValue(iListItem);
            }
            dataTable.Rows.Add(values);
        }
        return dataTable;
    }
}
