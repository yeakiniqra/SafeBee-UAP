describe('Signin Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should successfully sign in with valid credentials', async () => {
 
    await waitFor(element(by.id('scroll-view')))
      .toBeVisible()
      .whileElement(by.id('scroll-view'))
      .scroll(50, 'down');


    await expect(element(by.id('signin-title-main'))).toBeVisible();
    await expect(element(by.id('signin-subtitle'))).toBeVisible();


    await element(by.id('email-input')).tap();
    await element(by.id('email-input')).typeText('yeakintheiqra@gmail.com');
    await element(by.id('email-input')).tapReturnKey();

  
    await element(by.id('password-input')).tap();
    await element(by.id('password-input')).typeText('112233');
    await element(by.id('password-input')).tapReturnKey();

    await element(by.id('signin-button')).tap();


    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(7000); 
  });
});

describe('Navigation Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to Flood page and return to Home', async () => {

    await element(by.id('flood')).tap();

    await waitFor(element(by.id('flood-page')))
      .toBeVisible()
      .withTimeout(5000);

    await device.pressBack();

    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to Fire Alert page and return to Home', async () => {

    await element(by.id('fire-alert')).tap();

    await waitFor(element(by.id('firealert-page')))
      .toBeVisible()
      .withTimeout(5000);
  
    await device.pressBack();
  
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to Safety Tips page and return to Home', async () => {
 
    await element(by.id('safety-tips')).tap();
   
    await waitFor(element(by.id('safety-page')))
      .toBeVisible()
      .withTimeout(5000);
   
    await device.pressBack();
    
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to Fire Service page and return to Home', async () => {
   
    await element(by.id('fire-service')).tap();
  
    await waitFor(element(by.id('fire-page')))
      .toBeVisible()
      .withTimeout(5000);
    
    await device.pressBack();
   
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to Helpline page and return to Home', async () => {

    await element(by.id('helpline')).tap();
   
    await waitFor(element(by.id('helpline-page')))
      .toBeVisible()
      .withTimeout(5000);
  
    await device.pressBack();
   
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to Hospital page and return to Home', async () => {
  
    await element(by.id('hospital')).tap();
   
    await waitFor(element(by.id('hospital-page')))
      .toBeVisible()
      .withTimeout(5000);

    await device.pressBack();
  
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should navigate to Shelter Center page and return to Home', async () => {
   
    await element(by.id('shelter-center')).tap();
  
    await waitFor(element(by.id('shelter-page')))
      .toBeVisible()
      .withTimeout(5000);
    
    await device.pressBack();

    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
