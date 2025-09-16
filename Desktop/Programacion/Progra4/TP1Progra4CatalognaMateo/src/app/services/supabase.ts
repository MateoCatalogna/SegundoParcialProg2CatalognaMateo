import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs'; //observable con estado, guarda la última emisión y entrega ese valor inmediatamente a nuevos suscriptores
import { environment } from '../../enviroments/enviroment';

//createClient crea la instancia que maneja la comunicación con Supabase
//SupabaseClient tipo TS del cliente
//User describe el objeto usuario que devuelve Supabase

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient; //contiene la instancia del cliente supabase

  // Observables públicos para usuario y nombre
  private _user$ = new BehaviorSubject<User | null>(null); //observable que mantiene el User actual o null. si inicialzia en null, cualquier componente que se suscriba recibe el usuario actual(si existe)
  private _userName$ = new BehaviorSubject<string | null>(null); //observable con el nombre de usuario leído desde la tabla usuarios. También inicializado en null.

    // Observables públicos (solo lectura)
  public user$ = this._user$.asObservable();
  public userName$ = this._userName$.asObservable();

  
  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initUser();
  }

  // Inicializar usuario desde sesión activa
  private async initUser() {
    const { data } = await this.supabase.auth.getSession(); //devuelve la sesion actual si la hay y la guarda en data
    const user = data?.session?.user ?? null; //Hay sesión válida → data.session existe y data.session.user contiene el User.
    // se usa ? para evitar errores si llega un undefined el resultado puede ser user o null
    this._user$.next(user); // se emite el ususario actual al BehaviorSubject para que todos los componentes suscriptos reciban el valor

    if (user) {
      const name = await this.fetchUserName(user.id); // consulta a la tabla para obtener el nombre
      this._userName$.next(name); // cuando se obtiene se envia al BehaviorSubject para que todos los componentes suscriptos reciban el valor

    }

    // Suscribirse a cambios de sesión futuros
    this.supabase.auth.onAuthStateChange(async (_event, session) => { //Registra un listener que Supabase llamará cada vez que cambie el estado de autenticación.
      const currentUser = session?.user ?? null; //? para acceder a user solo si session no es undefined/null. ?? null garantiza que currentUser sea null si no hay sesión.
      this._user$.next(currentUser); //Actualiza el BehaviorSubject  _user$ con el valor nuevo (user o null).

      if (currentUser) { // si hay sesion activa
        const name = await this.fetchUserName(currentUser.id); //Llama al método fetchUserName para obtener el campo nombre.
        this._userName$.next(name); // Emite por el BehaviorSubject _userName$ el nombre recuperado
      } else { // si se cierra sesion 
        this._userName$.next(null); // el nombre de usario es null
      }
    });
  }

  // Login
  async signIn(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password }); // signInWithPassword metodo de supabase para autenticar al usuario
    //con mail y contraseña dados
    if (error) throw error;// si supabase devolvio error tirar el error
    return data.user;// retorna al usuario 
  }

  // Logout
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut(); //metodo de supabase para cerrar sesion
    if (error) throw error;
    this._user$.next(null); //BehaviorSubject que mantiene el User actual next(null) emite null como nuevo valor.
    this._userName$.next(null); //limpia el BehaviorSubject que contiene el nombre del usuario
  }

  // Obtener nombre de usuario desde tabla "usuarios"
  private async fetchUserName(userId: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('nombre')
      .eq('id', userId)
      .single();   //Pide sólo la columna nombre de la fila donde id = userId.

    if (error) {
      console.error('Error obteniendo nombre de usuario:', error);
      return null;
    }

    return data?.nombre ?? null; //si data existe devolvés nombre, sino null
  }
}
