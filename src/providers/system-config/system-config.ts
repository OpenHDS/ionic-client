import { HttpClient} from "@angular/common/http";


export class SystemConf {
  private static instance: SystemConf = new SystemConf();
  private defaultURL = "http://130.111.126.71:8081/openhds2/api2/rest/";
  private testingFieldworker= "FWDW1";
  private testingLocLevel: string = "MBI";

  private constructor(){}

  public static getInstance(){
    return this.instance;
  }

  public getServerURL(){
    return this.defaultURL;
  }

  public getTestingFieldworker(){
    return this.testingFieldworker;
  }

  public getTestingLocLevel(){
    return this.testingLocLevel;
  }
}
