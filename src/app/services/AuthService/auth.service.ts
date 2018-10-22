import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MenuController} from '@ionic/angular';
import Bcrypt from 'bcryptjs';
import {FieldworkerService} from '../FieldworkerService/fieldworker.service';
import {UserService} from '../UserService/user-service';
import {User} from '../../models/user';
import {Fieldworker} from '../../models/fieldworker';


@Injectable({
    providedIn: 'root',
})

export class AuthService {
    loggedInSupervisor: User;
    loggedInFieldworker: Fieldworker;
    isUserLoggedIn = false;

    constructor(public http: HttpClient, public userProvider: UserService,
                public fieldworkerProvider: FieldworkerService, public menu: MenuController) {
        console.log('Hello AuthProvider Provider');
    }

    async login(username, password, supervisor?) {

        if (supervisor) {
            const user = await this.userProvider.loadSupervisorUser(username, password);
            if (user.length === 0 || !Bcrypt.compareSync(password, user[0].password)) {
                return false;
            }

            this.loggedInSupervisor = user[0];
            this.isUserLoggedIn = true;
            return true;
        }

        const fieldworker = await this.fieldworkerProvider.getFieldworker(username);
        if (fieldworker.length === 0 || !Bcrypt.compareSync(password, fieldworker[0].passwordHash)) {
            return false;
        }

        this.loggedInFieldworker = fieldworker[0];
        return true;
    }

    setMenu() {
        if (this.isUserLoggedIn) {
            this.menu.enable(true, 'adminMenu');
        } else {
            this.menu.enable(true, 'fieldworkerMenu');
        }
    }

    disableMenu() {
        if (this.isUserLoggedIn) {
            this.menu.enable(false, 'adminMenu');
        } else {
            this.menu.enable(false, 'fieldworkerMenu');
        }
    }

    logout() {
        if (this.isUserLoggedIn) {
            this.loggedInSupervisor = undefined;
        } else {
            this.loggedInFieldworker = undefined;
        }
    }

    getLoggedInUser() {
        return this.loggedInSupervisor;
    }

    getLoggedInFieldworker() {
        return this.loggedInFieldworker;
    }

    hasFieldworkerLoggedIn() {
        return this.loggedInFieldworker !== undefined;
    }

    hasSupervisorLoggedIn() {
        return this.loggedInSupervisor !== undefined;
    }

    canAccess() {

    }
}
